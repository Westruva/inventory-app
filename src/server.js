require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const partsRouter = require("./routes/parts");
const vehiclesRouter = require("./routes/vehicles");
const fitmentRouter = require("./routes/fitment");
const webRouter = require("./routes/web");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/parts", partsRouter);
app.use("/api/vehicles", vehiclesRouter);
app.use("/api/fitment", fitmentRouter);
app.use("/", webRouter);

app.get("/health", (req, res) => res.json({ status: "ok" }));

// Central error handler - keeps individual routes free of try/catch boilerplate for unexpected errors.
app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
