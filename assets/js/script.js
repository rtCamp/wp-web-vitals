/**
 * CrUX API utility.
 *
 * @since 1.0.0
 * @package WP_Web_Vitals
 */

const CrUXApiUtil = {};
CrUXApiUtil.KEY = wpWebVitals.cruxApiKey;

// Gather the data for example.com and display it.
async function generateReport() {
	const endpointUrl = 'https://chromeuxreport.googleapis.com/v1/records:queryRecord';
	const resp = await fetch( `${endpointUrl}?key=${CrUXApiUtil.KEY}`, {
		method: 'POST',
		body: JSON.stringify( {
			origin: window.location.href
		} ),
	} );

	const json = await resp.json();

	if (!resp.ok) {
		throw new Error( json.error.message );
	}

	const labeledMetrics = labelMetricData( json.record.metrics );

	let wrapper = document.createElement( 'div' );
	wrapper.setAttribute( "id", "web-vitals-report-wrap" );
	document.body.appendChild( wrapper );

	// Display metric results.
	for (const metric of labeledMetrics) {

		const metricEl = document.createElement( 'section' );

		const titleEl = document.createElement( 'h2' );
		titleEl.textContent = metric.acronym;

		const [descEl, barsEl] = createDescriptionAndBars( metric );

		metricEl.append( titleEl, descEl, barsEl );
		document.getElementById( 'web-vitals-report-wrap' ).append( metricEl );
	}
	// Initially hide the report.
	jQuery( "#web-vitals-report-wrap" ).hide();
}

/**
 * Utility method to transform the response's metric data into an array of usable metric objects
 * Example return value:
  [
    {
      "acronym": "FCP",
      "name": "first_contentful_paint",
      "labeledBins": [{
        "label": "good",
        "percentage": 43.51,
        "start": 0,
        "end": 1000,
        "density": 0.4351
      }, // ... (other bins) ]
    }, // ... (other metrics) ]
 *
 * @return {{acronym: string, name: string, labelsBins: Array<{label: 'good'|'needs improvement'|'poor', percentage: number, start: number, end?: number, density: number}>}}*/
function labelMetricData(metrics) {
	const nameToAcronymMap = {
		first_contentful_paint: "FCP",
		largest_contentful_paint: "LCP",
		first_input_delay: "FID",
		cumulative_layout_shift: "CLS",
		interaction_to_next_paint: "INP",
		experimental_time_to_first_byte: "TTFB",
	};

	return Object.entries(metrics).map(([metricName, metricData]) => {
		if (!metricData || !metricData.histogram) {
			return {
				acronym: nameToAcronymMap[metricName] || metricName.toUpperCase(),
				name: metricName,
				percentiles: metricData?.percentiles || {},
			};
		}

		const standardBinLabels = ["good", "needs improvement", "poor"];
		const labeledBins = Array.isArray(metricData.histogram)
			? metricData.histogram.map((bin, i) => ({
					label: standardBinLabels[i] || "unknown", // Ensure index does not go out of bounds.
					percentage: (bin.density * 100).toFixed(2),
					start: bin.start,
					end: bin.end,
					density: bin.density,
			  }))
			: [];

		return {
			acronym: nameToAcronymMap[metricName] || metricName.toUpperCase(),
			name: metricName,
			labeledBins,
			percentiles: metricData.percentiles || {},
		};
	});
}

// Create the three bars w/ a 3-column grid.
// This consumes the output from labelMetricData, not a raw API response.
function createDescriptionAndBars(metric) {
	let labeledBins = metric.labeledBins || [];

	const descEl = document.createElement("p");
	// Example: 'good: 43.63%, needs improvement: 42.10%, poor: 14.27%'.
	descEl.textContent = labeledBins
		.map((bin) => `${bin.label}: ${parseFloat(bin.percentage).toFixed(2)}%`)
		.join(", ");

	let barsEl = document.createElement("div");

	let class_name = metric.acronym.toLowerCase();

	let adminBarParent = document.createElement("div");
	let adminBarClass = `web-vitals-admin-bar-${class_name}`;
	adminBarParent.classList.add(adminBarClass);
	adminBarParent.innerHTML = `<div class="web-vitals-good"></div>
    <div class="web-vitals-needs-improvement"></div>
    <div class="web-vitals-poor"></div>`;
	document
		.getElementById("web-vitals-admin-container")
		.appendChild(adminBarParent);

	for (const bin of labeledBins) {
		const barEl = document.createElement("div");
		// Reuse the label for the styling class, changing any spaces: `needs improvement` => `needs-improvement`.
		barEl.classList.add(`box-${bin.label.replace(" ", "-")}`);
		barsEl.append(barEl);

		let percentage = parseFloat(bin.percentage) || 0; // Ensure percentage is a number.

		if ("good" === bin.label) {
			jQuery(`.${adminBarClass} .web-vitals-good`)
				.width(`${percentage}%`)
				.height(8);
		} else if ("needs improvement" === bin.label) {
			jQuery(`.${adminBarClass} .web-vitals-needs-improvement`)
				.width(`${percentage}%`)
				.height(8);
		} else if ("poor" === bin.label) {
			jQuery(`.${adminBarClass} .web-vitals-poor`)
				.width(`${percentage}%`)
				.height(8);
		}
	}

	// Set the width of the bar columns based on metric bins.
	// Ex: `grid-template-columns: 43.51% 42.26% 14.23%`;.
	barsEl.style.gridTemplateColumns = labeledBins
		.map((bin) => `${parseFloat(bin.percentage) || 0}%`)
		.join(" ");
	barsEl.classList.add(`grid-container`);

	return [descEl, barsEl];
}

jQuery(document).ready(function ($) {
	generateReport();

	$("#web-vitals-admin-container").on("click", function (event) {
		event.preventDefault();

		let report_wrap = $("#web-vitals-report-wrap");

		if (report_wrap.is(":hidden")) {
			report_wrap.show();
		} else {
			report_wrap.hide();
		}
	});

	$(document).on("mouseup", function (e) {
		let container = $("#web-vitals-report-wrap");

		// if the target of the click isn't the container nor a descendant of the container.
		if (!container.is(e.target) && container.has(e.target).length === 0) {
			$("#web-vitals-report-wrap").hide();
		}
	});
});
