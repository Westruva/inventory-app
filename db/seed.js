const pool = require("./pool");

// Sample data for local development/testing. Safe to re-run - uses ON CONFLICT to avoid duplicates.
async function seed() {
	try {
		const partsResult = await pool.query(
			`INSERT INTO parts (part_number, brand, part_name, category, cost, retail_price, quantity_on_hand, reorder_level, location_bin)
       VALUES
         ('BRK-0001', 'Bosch', 'Front Brake Pads', 'Brakes', 18.50, 39.99, 24, 5, 'A1'),
         ('OIL-0002', 'Mobil 1', 'Synthetic Engine Oil 5W-30 (5qt)', 'Fluids', 22.00, 34.99, 40, 10, 'B2'),
         ('FLT-0003', 'K&N', 'Air Filter', 'Filters', 12.00, 24.99, 15, 5, 'B3'),
         ('SPK-0004', 'NGK', 'Spark Plug', 'Ignition', 4.50, 9.99, 60, 20, 'C1'),
         ('BAT-0005', 'Interstate', '12V Car Battery', 'Electrical', 65.00, 129.99, 8, 3, 'D1')
       ON CONFLICT (part_number) DO NOTHING
       RETURNING part_id, part_number`,
		);

		const vehiclesResult = await pool.query(
			`INSERT INTO vehicles (year, make, model, engine_trim)
       VALUES
         (2018, 'Toyota', 'Corolla', '1.8L'),
         (2020, 'Ford', 'F-150', '5.0L V8'),
         (2019, 'Honda', 'Civic', '2.0L')
       RETURNING vehicle_id, make, model`,
		);

		console.log(
			`Inserted ${partsResult.rowCount} parts, ${vehiclesResult.rowCount} vehicles.`,
		);

		// Look up ids fresh (in case some rows already existed and were skipped above).
		const parts = (await pool.query("SELECT part_id, part_number FROM parts"))
			.rows;
		const vehicles = (
			await pool.query("SELECT vehicle_id, make, model FROM vehicles")
		).rows;

		const findPart = (partNumber) =>
			parts.find((p) => p.part_number === partNumber).part_id;
		const findVehicle = (make, model) =>
			vehicles.find((v) => v.make === make && v.model === model).vehicle_id;

		const fitmentPairs = [
			[findPart("BRK-0001"), findVehicle("Toyota", "Corolla")],
			[findPart("OIL-0002"), findVehicle("Toyota", "Corolla")],
			[findPart("OIL-0002"), findVehicle("Ford", "F-150")],
			[findPart("FLT-0003"), findVehicle("Honda", "Civic")],
			[findPart("SPK-0004"), findVehicle("Honda", "Civic")],
		];

		for (const [partId, vehicleId] of fitmentPairs) {
			await pool.query(
				`INSERT INTO part_fitment (part_id, vehicle_id)
         VALUES ($1, $2)
         ON CONFLICT ON CONSTRAINT unique_fitment DO NOTHING`,
				[partId, vehicleId],
			);
		}

		console.log("Fitment links seeded.");
	} catch (err) {
		console.error("Seeding failed:", err.message);
		process.exitCode = 1;
	} finally {
		await pool.end();
	}
}

seed();
