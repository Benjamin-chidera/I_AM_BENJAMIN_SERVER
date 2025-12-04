import { Router } from "express";
import {
  getSocial,
  postSocial,
  updateSocial,
  deleteSocial,
} from "../controller/social";

import {
  postResume,
  getResume,
  updateResume,
  deleteResume,
} from "../controller/resume";

import {
  postAbout,
  getAbout,
  updateAbout,
  // deleteAbout,
} from "../controller/about";

import {
  postProjects,
  getProjects,
  updateProject,
  deleteProject,
} from "../controller/projects";

import {
  postExperience,
  getExperience,
  updateExperience,
  deleteExperience,
} from "../controller/experience";

import {
  postSkills,
  getSkills,
  updateSkills,
  deleteSkills,
} from "../controller/skills";

import {
  postCertification,
  getCertification,
  updateCertification,
  deleteCertification,
} from "../controller/certifications";

const router = Router();

// this is for resume routes
router.route("/resume").post(postResume).get(getResume);
router.route("/resume/:id").patch(updateResume).delete(deleteResume);
 
// this is for social routes
router.route("/social").post(postSocial).get(getSocial);
router.route("/social/:id").patch(updateSocial).delete(deleteSocial);

// this is for about routes
router.route("/about").post(postAbout).get(getAbout);
router.route("/about/:id").patch(updateAbout);
// .delete(deleteAbout);
 
// this is for projects routes
router.route("/projects").post(postProjects).get(getProjects);
router.route("/projects/:id").patch(updateProject).delete(deleteProject);

// this is for experience routes
router.route("/experience").post(postExperience).get(getExperience);
router.route("/experience/:id").patch(updateExperience).delete(deleteExperience);

// this is for skills routes
router.route("/skills").post(postSkills).get(getSkills);
router.route("/skills/:id").patch(updateSkills).delete(deleteSkills);

// this is for certifications routes
router.route("/certifications").post(postCertification).get(getCertification);
router
  .route("/certifications/:id")
  .patch(updateCertification)
  .delete(deleteCertification);

export default router;
