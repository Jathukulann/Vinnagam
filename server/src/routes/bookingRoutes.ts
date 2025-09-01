import { Router } from "express";
import { createBooking, checkAvailability, getBookedDates } from "../controllers/bookingControllers";

const router = Router();

router.post("/", createBooking);
router.get("/availability/:propertyId", checkAvailability);
router.get("/booked-dates/:propertyId", getBookedDates);

export default router;