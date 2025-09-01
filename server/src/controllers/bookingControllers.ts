import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { 
      propertyId, 
      checkIn, 
      checkOut, 
      guests, 
      guestName, 
      guestEmail, 
      guestPhone 
    } = req.body;

    // Calculate nights and price
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    // Get property price
    const property = await prisma.property.findUnique({
      where: { id: parseInt(propertyId) }
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const dailyRate = property.pricePerMonth / 30;
    const totalPrice = dailyRate * nights;

    // Check availability
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        propertyId: parseInt(propertyId),
        status: { not: "CANCELLED" },
        OR: [
          {
            AND: [
              { checkIn: { lte: start } },
              { checkOut: { gt: start } }
            ]
          },
          {
            AND: [
              { checkIn: { lt: end } },
              { checkOut: { gte: end } }
            ]
          },
          {
            AND: [
              { checkIn: { gte: start } },
              { checkOut: { lte: end } }
            ]
          }
        ]
      }
    });

    if (conflictingBooking) {
      return res.status(400).json({ 
        message: "Property is not available for selected dates" 
      });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        propertyId: parseInt(propertyId),
        checkIn: start,
        checkOut: end,
        guests: parseInt(guests),
        nights,
        totalPrice,
        guestName,
        guestEmail,
        guestPhone,
        status: "PENDING"
      },
      include: {
        property: {
          select: {
            name: true,
            location: true
          }
        }
      }
    });

    res.status(201).json({
      message: "Booking request submitted successfully",
      booking
    });

  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ 
      message: "Error creating booking", 
    //   error: error.message 
    });
  }
};

export const checkAvailability = async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.params;
    const { checkIn, checkOut } = req.query;

    const start = new Date(checkIn as string);
    const end = new Date(checkOut as string);

    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        propertyId: parseInt(propertyId),
        status: { not: "CANCELLED" },
        OR: [
          {
            AND: [
              { checkIn: { lte: start } },
              { checkOut: { gt: start } }
            ]
          },
          {
            AND: [
              { checkIn: { lt: end } },
              { checkOut: { gte: end } }
            ]
          },
          {
            AND: [
              { checkIn: { gte: start } },
              { checkOut: { lte: end } }
            ]
          }
        ]
      }
    });

    res.json({ 
      available: !conflictingBooking,
      message: conflictingBooking ? "Dates not available" : "Dates available"
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Error checking availability" 
    });
  }
};

// Add this new function to your existing file

export const getBookedDates = async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.params;

    const bookings = await prisma.booking.findMany({
      where: {
        propertyId: parseInt(propertyId),
        status: { not: "CANCELLED" }
      },
      select: {
        checkIn: true,
        checkOut: true
      }
    });

    // Generate all dates between check-in and check-out for each booking
    const bookedDates: string[] = [];
    
    bookings.forEach(booking => {
      const currentDate = new Date(booking.checkIn);
      const endDate = new Date(booking.checkOut);
      
      while (currentDate < endDate) {
        bookedDates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    res.json({ bookedDates });

  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching booked dates" 
    });
  }
};