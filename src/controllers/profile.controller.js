import {   profileService   } from "../services/index.js";

export const getMyProfile = async (req, res, next) => {
    try {
        const profile = await profileService.getProfileByUserId(req.user.id);
        res.json({ success: true, data: profile });
    } catch (err) { next(err); }
};

export const getByUserId = async (req, res, next) => {
    try {
        const profile = await profileService.getProfileByUserId(req.params.userId);
        res.json({ success: true, data: profile });
    } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
    try {
        const profile = await profileService.updateProfile({
            userId: req.user.id,
            dto: req.body,
        });
        res.json({ success: true, data: profile });
    } catch (err) { next(err); }
};

