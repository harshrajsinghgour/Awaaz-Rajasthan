"use strict";

const Ad = require("../models/Ad");

/**
 * ========================================================
 * AD ANALYTICS CONTROLLER
 * ========================================================
 *
 * यह Controller केवल Owner Dashboard के लिए है।
 *
 * इसमें:
 * - Total Ads
 * - Active Ads
 * - Inactive Ads
 * - Total Impressions
 * - Total Clicks
 * - CTR
 * - Best Performing Ads
 * - Position-wise Analytics
 *
 * शामिल हैं।
 *
 * IMPORTANT:
 * Route पर ownerOnly middleware लगाना जरूरी है।
 * ========================================================
 */


/* ========================================================
   HELPER: CTR CALCULATION
======================================================== */

function calculateCTR(impressions, clicks) {
    if (!impressions || impressions <= 0) {
        return 0;
    }

    return Number(
        ((clicks / impressions) * 100).toFixed(2)
    );
}


/* ========================================================
   GET OVERALL AD ANALYTICS
======================================================== */
// GET /api/admin/ad-analytics
//
// Owner only
//
// Returns:
// - total ads
// - active ads
// - inactive ads
// - impressions
// - clicks
// - CTR
// - best ads

exports.getAdAnalytics = async (req, res) => {
    try {
        const ads = await Ad.find()
            .select(
                "name advertiserName position adType isActive impressions clicks priority createdAt"
            )
            .sort({
                priority: -1,
                createdAt: -1
            })
            .lean();


        /* ====================================================
           BASIC COUNTS
        ==================================================== */

        const totalAds = ads.length;

        const activeAds = ads.filter(
            (ad) => ad.isActive === true
        ).length;

        const inactiveAds = ads.filter(
            (ad) => ad.isActive !== true
        ).length;


        /* ====================================================
           TOTAL IMPRESSIONS & CLICKS
        ==================================================== */

        const totalImpressions = ads.reduce(
            (total, ad) =>
                total + Number(ad.impressions || 0),
            0
        );

        const totalClicks = ads.reduce(
            (total, ad) =>
                total + Number(ad.clicks || 0),
            0
        );


        /* ====================================================
           OVERALL CTR
        ==================================================== */

        const ctr = calculateCTR(
            totalImpressions,
            totalClicks
        );


        /* ====================================================
           AD-WISE ANALYTICS
        ==================================================== */

        const adPerformance = ads.map((ad) => ({
            id: ad._id,
            name: ad.name,
            advertiserName:
                ad.advertiserName || "",
            position:
                ad.position || "",
            adType:
                ad.adType || "",
            isActive:
                Boolean(ad.isActive),
            impressions:
                Number(ad.impressions || 0),
            clicks:
                Number(ad.clicks || 0),
            ctr: calculateCTR(
                Number(ad.impressions || 0),
                Number(ad.clicks || 0)
            ),
            priority:
                Number(ad.priority || 0),
            createdAt:
                ad.createdAt
        }));


        /* ====================================================
           BEST PERFORMING ADS
        ==================================================== */

        const bestByClicks = [...adPerformance]
            .sort(
                (a, b) =>
                    b.clicks - a.clicks
            )
            .slice(0, 5);

        const bestByImpressions = [...adPerformance]
            .sort(
                (a, b) =>
                    b.impressions -
                    a.impressions
            )
            .slice(0, 5);

        const bestByCTR = [...adPerformance]
            .filter(
                (ad) =>
                    ad.impressions > 0
            )
            .sort(
                (a, b) =>
                    b.ctr - a.ctr
            )
            .slice(0, 5);


        /* ====================================================
           POSITION-WISE ANALYTICS
        ==================================================== */

        const positionMap = {};

        ads.forEach((ad) => {
            const position =
                ad.position ||
                "unknown";

            if (!positionMap[position]) {
                positionMap[position] = {
                    position,
                    ads: 0,
                    impressions: 0,
                    clicks: 0
                };
            }

            positionMap[position].ads += 1;

            positionMap[position]
                .impressions +=
                Number(ad.impressions || 0);

            positionMap[position]
                .clicks +=
                Number(ad.clicks || 0);
        });


        const positionAnalytics =
            Object.values(positionMap).map(
                (item) => ({
                    ...item,
                    ctr: calculateCTR(
                        item.impressions,
                        item.clicks
                    )
                })
            );


        /* ====================================================
           RESPONSE
        ==================================================== */

        return res.status(200).json({
            success: true,

            summary: {
                totalAds,
                activeAds,
                inactiveAds,
                totalImpressions,
                totalClicks,
                ctr
            },

            bestPerforming: {
                byClicks: bestByClicks,
                byImpressions:
                    bestByImpressions,
                byCTR: bestByCTR
            },

            positionAnalytics
        });

    } catch (error) {
        console.error(
            "Get ad analytics error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "विज्ञापन Analytics प्राप्त करने में समस्या हुई।"
        });
    }
};


/* ========================================================
   GET SINGLE AD ANALYTICS
======================================================== */
// GET /api/admin/ad-analytics/:id
//
// Owner only
//
// किसी एक Advertisement की पूरी performance।

exports.getSingleAdAnalytics = async (
    req,
    res
) => {
    try {
        const ad = await Ad.findById(
            req.params.id
        )
            .select(
                "name advertiserName position adType isActive impressions clicks priority startDate endDate createdAt updatedAt"
            )
            .lean();


        if (!ad) {
            return res.status(404).json({
                success: false,
                message:
                    "विज्ञापन नहीं मिला।"
            });
        }


        const impressions =
            Number(ad.impressions || 0);

        const clicks =
            Number(ad.clicks || 0);

        const ctr = calculateCTR(
            impressions,
            clicks
        );


        return res.status(200).json({
            success: true,

            ad: {
                id: ad._id,
                name: ad.name,
                advertiserName:
                    ad.advertiserName || "",
                position:
                    ad.position || "",
                adType:
                    ad.adType || "",
                isActive:
                    Boolean(ad.isActive),
                priority:
                    Number(ad.priority || 0),
                startDate:
                    ad.startDate || null,
                endDate:
                    ad.endDate || null,
                createdAt:
                    ad.createdAt || null,
                updatedAt:
                    ad.updatedAt || null
            },

            analytics: {
                impressions,
                clicks,
                ctr
            }
        });

    } catch (error) {
        console.error(
            "Get single ad analytics error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "विज्ञापन Analytics प्राप्त करने में समस्या हुई।"
        });
    }
};


/* ========================================================
   EXPORT
======================================================== */

module.exports = {
    getAdAnalytics,
    getSingleAdAnalytics
};
