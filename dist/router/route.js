"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const social_1 = require("../controller/social");
const resume_1 = require("../controller/resume");
const about_1 = require("../controller/about");
const projects_1 = require("../controller/projects");
const experience_1 = require("../controller/experience");
const skills_1 = require("../controller/skills");
const certifications_1 = require("../controller/certifications");
const router = (0, express_1.Router)();
// this is for resume routes
router.route("/resume").post(resume_1.postResume).get(resume_1.getResume);
router.route("/resume/:id").patch(resume_1.updateResume).delete(resume_1.deleteResume);
// this is for social routes
router.route("/social").post(social_1.postSocial).get(social_1.getSocial);
router.route("/social/:id").patch(social_1.updateSocial).delete(social_1.deleteSocial);
// this is for about routes
router.route("/about").post(about_1.postAbout).get(about_1.getAbout);
router.route("/about/:id").patch(about_1.updateAbout);
// .delete(deleteAbout);
// this is for projects routes
router.route("/projects").post(projects_1.postProjects).get(projects_1.getProjects);
router.route("/projects/:id").patch(projects_1.updateProject).delete(projects_1.deleteProject);
// this is for experience routes
router.route("/experience").post(experience_1.postExperience).get(experience_1.getExperience);
router.route("/experience/:id").patch(experience_1.updateExperience).delete(experience_1.deleteExperience);
// this is for skills routes
router.route("/skills").post(skills_1.postSkills).get(skills_1.getSkills);
router.route("/skills/:id").patch(skills_1.updateSkills).delete(skills_1.deleteSkills);
// this is for certifications routes
router.route("/certifications").post(certifications_1.postCertification).get(certifications_1.getCertification);
router
    .route("/certifications/:id")
    .patch(certifications_1.updateCertification)
    .delete(certifications_1.deleteCertification);
exports.default = router;
