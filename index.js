const url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
const req = new XMLHttpRequest(),
    value = [];
const width = 800,
    height = 550,
    padding = 40;
let xScale, yScale;

const tooltip = d3.select("#tooltip");

const svg = d3.select("svg");

const drawCanvas = () => {
    svg.attr("width", width);
    svg.attr("height", height);
};

const generateScales = () => {
    xScale = d3
        .scaleLinear()
        .domain([
            d3.min(values, (item) => item["Year"]) - 1,
            d3.max(values, (item) => item["Year"]) + 1,
        ])
        .range([padding, width - padding]);

    yScale = d3
        .scaleTime()
        .domain([
            d3.min(values, (item) => new Date(item["Seconds"] * 1000)),
            d3.max(values, (item) => new Date(item["Seconds"] * 1000)),
        ])
        .range([padding, height - padding]);
};

const drawDots = () => {
    svg.selectAll("circle")
        .data(values)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", "5")
        .attr("data-xvalue", (item) => item["Year"])
        .attr("data-yvalue", (item) => new Date(item["Seconds"] * 1000))
        .attr("cx", (item) => xScale(item["Year"]))
        .attr("cy", (item) => yScale(new Date(item["Seconds"] * 1000)))
        .attr("fill", (item) => (item["Doping"] !== "" ? "red" : "green"))
        .on("mouseover", (item) => {
            tooltip.transition().style("visibility", "visible");
            item["Doping"] !== ""
                ? tooltip.text(
                      `${item["Name"]} (${item["Nationality"]}) | Year: ${item["Year"]} | Time: ${item["Time"]} | ${item["Doping"]}`
                  )
                : tooltip.text(
                      `${item["Name"]} (${item["Nationality"]}) | Year: ${item["Year"]} | Time: ${item["Time"]} | No allegations`
                  );
            tooltip.attr("data-year", item["Year"]);
        })
        .on("mouseout", (item) => {
            tooltip.transition().style("visibility", "hidden");
        });
};

const generateAxes = () => {
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height - padding})`);

    svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0)`);
};

req.open("GET", url, true);
req.onload = () => {
    values = JSON.parse(req.responseText);
    drawCanvas();
    generateScales();
    drawDots();
    generateAxes();
};
req.send();
