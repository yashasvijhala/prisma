import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const port = 3000;
app.use(express.json());
const prisma = new PrismaClient();

app.post("/airlines", async (req, res) => {
  const { name, airportIds } = req.body;

  const airline = await prisma.airline.create({
    data: {
      name,
      airlineAirport: {
        createMany: airportIds.map((id) => ({
          airportId: parseInt(id),
        })),
      },
    },
  });

  res.json(airline);
});

app.patch("/airlines/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const updatedAirline = await prisma.airline.update({
    where: { id: parseInt(id) },
    data: { name },
  });

  res.json(updatedAirline);
});

app.delete("/airlines/:id", async (req, res) => {
  const { id } = req.params;

  const deletedAirline = await prisma.airline.delete({
    where: { id: parseInt(id) },
  });

  res.json(deletedAirline);
});

app.get("/airlines", async (req, res) => {
  const airlines = await prisma.airline.findMany({
    include: { airlineAirport: true },
  });
  res.json(airlines);
});

app.post("/airports", async (req, res) => {
  const { name, airlineIds } = req.body;

  const airport = await prisma.airport.create({
    data: {
      name,
    },
  });
  console.log(
    airlineIds.map((id) => ({
      airlineId: id,
      airportId: airport.id,
    }))
  );
  await prisma.airlineAirport.createMany({
    data: airlineIds.map((id) => ({
      airlineId: id,
      airportId: airport.id,
    })),
  });

  res.json(airport);
});

app.patch("/airports/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const updatedAirport = await prisma.airport.update({
    where: { id: parseInt(id) },
    data: { name },
  });

  res.json(updatedAirport);
});

app.delete("/airports/:id", async (req, res) => {
  const { id } = req.params;

  const deletedAirport = await prisma.airport.delete({
    where: { id: parseInt(id) },
  });

  res.json(deletedAirport);
});

app.get("/airports", async (req, res) => {
  const airports = await prisma.airport.findMany({
    include: {
      airlineAirport: {
        include: {
          airline: true
        }
      },
    },
  });

  res.json(airports);
});

app.listen(port, () => console.log(`Server is running on PORT ${port}`));
