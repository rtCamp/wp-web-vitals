const apiKey = "AIzaSyB2MNhStdKzadnaTn995wFP4lMtTdIQkKY";
const CrUXApiUtil = {};
CrUXApiUtil.KEY = apiKey;

// Gather the data for example.com and display it
async function generateReport() {

	const endpointUrl = 'https://chromeuxreport.googleapis.com/v1/records:queryRecord';
	const resp = await fetch( `${endpointUrl}?key=${CrUXApiUtil.KEY}`, {
		method: 'POST',
		body: JSON.stringify( {
			origin: 'https://rtcamp.com'
		} ),
	} );

	if (!resp.ok) {
		throw new Error( json.error.message );
	}

	const json = await resp.json();

	console.log( 'CrUX API response:', json );

	const labeledMetrics = labelMetricData( json.record.metrics );

	let wrapper = document.createElement( 'div' );
	wrapper.setAttribute( "id", "web-vitals-report-wrap" );
	document.getElementById( "wp-admin-bar-web_vitals_admin_bar" ).appendChild( wrapper );

	// Display metric results
	for (const metric of labeledMetrics) {
		generateAdminBarIndicator( metric );

		const metricEl = document.createElement( 'section' );

		const titleEl = document.createElement( 'h2' );
		titleEl.textContent = metric.acronym;

		const [descEl, barsEl] = createDescriptionAndBars( metric.labeledBins );

		metricEl.append( titleEl, descEl, barsEl );
		document.getElementById( 'web-vitals-report-wrap' ).append( metricEl );
	}
	// Initially hide the report
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
function labelMetricData( metrics ) {
	const nameToAcronymMap = {
		first_contentful_paint: 'FCP',
		largest_contentful_paint: 'LCP',
		first_input_delay: 'FID',
		cumulative_layout_shift: 'CLS',
	};

	return Object.entries( metrics ).map( ( [metricName, metricData] ) => {
		const standardBinLabels = ['good', 'needs improvement', 'poor'];
		const metricBins = metricData.histogram;

		// We assume there are 3 histogram bins and they're in order of: good => poor
		const labeledBins = metricBins.map( ( bin, i ) => {
			// Assign a good/poor label, calculate a percentage, and add retain all existing bin properties
			return {
				label: standardBinLabels[i],
				percentage: bin.density * 100,
				...bin,
			};
		} );

		return {
			acronym: nameToAcronymMap[metricName],
			name: metricName,
			labeledBins,
		};
	} );
}

// Create the three bars w/ a 3-column grid
// This consumes the output from labelMetricData, not a raw API response.
function createDescriptionAndBars( labeledBins ) {
	const descEl = document.createElement( 'p' );
	// Example: 'good: 43.63%, needs improvement: 42.10%, poor: 14.27%'
	descEl.textContent = labeledBins
		.map( bin => `${bin.label}: ${bin.percentage.toFixed( 2 )}%` )
		.join( ', ' );

	let barsEl = document.createElement( 'div' );

	for (const bin of labeledBins) {
		const barEl = document.createElement( 'div' );
		// Reuse the label for the styling class, changing any spaces:  `needs improvement` => `needs-improvement`
		barEl.classList.add( `box-${bin.label.replace( ' ', '-' )}` );
		barsEl.append( barEl );
	}

	// Set the width of the bar columns based on metric bins
	// Ex: `grid-template-columns: 43.51% 42.26% 14.23%`;
	barsEl.style.gridTemplateColumns = labeledBins.map( bin => `${bin.percentage}%` ).join( ' ' );
	barsEl.classList.add( `grid-container` );

	return [descEl, barsEl];
}

// Create the admin bar indicator of web vitals metrics.
function generateAdminBarIndicator( metric ) {
	switch (metric.acronym) {
		case 'FCP':
			for (let idx = 0; idx < metric.labeledBins.length; idx++) {
				switch (metric.labeledBins[idx].label) {
				case 'good':
					jQuery( ".fcp .web-vitals-good" ).width( metric.labeledBins[idx].percentage ).height( 7 );
					break;

				case 'needs improvement':
					jQuery( ".fcp .web-vitals-ni" ).width( metric.labeledBins[idx].percentage ).height( 7 );
					break;

				case 'poor':
					jQuery( ".fcp .web-vitals-poor" ).width( metric.labeledBins[idx].percentage ).height( 7 );
					break;

				default:
					break;
				}
			}
			break;

		case 'LCP':
			for (let idx = 0; idx < metric.labeledBins.length; idx++) {
				switch (metric.labeledBins[idx].label) {
				case 'good':
					jQuery( ".lcp .web-vitals-good" ).width( metric.labeledBins[idx].percentage ).height( 7 );
					break;

				case 'needs improvement':
					jQuery( ".lcp .web-vitals-ni" ).width( metric.labeledBins[idx].percentage ).height( 7 );
					break;

				case 'poor':
					jQuery( ".lcp .web-vitals-poor" ).width( metric.labeledBins[idx].percentage ).height( 7 );
					break;

				default:
					break;
				}
			}
			break;

		case 'FID':
			for (let idx = 0; idx < metric.labeledBins.length; idx++) {
				switch (metric.labeledBins[idx].label) {
				case 'good':
					jQuery( ".fid .web-vitals-good" ).width( metric.labeledBins[idx].percentage ).height( 7 );
					break;

				case 'needs improvement':
					jQuery( ".fid .web-vitals-ni" ).width( metric.labeledBins[idx].percentage ).height( 7 );
					break;

				case 'poor':
					jQuery( ".fid .web-vitals-poor" ).width( metric.labeledBins[idx].percentage ).height( 7 );
					break;

				default:
					break;
				}
			}
			break;

		case 'CLS':
			for (let idx = 0; idx < metric.labeledBins.length; idx++) {
				switch (metric.labeledBins[idx].label) {
				case 'good':
					jQuery( ".cls .web-vitals-good" ).width( metric.labeledBins[idx].percentage ).height( 7 );
					break;

				case 'needs improvement':
					jQuery( ".cls .web-vitals-ni" ).width( metric.labeledBins[idx].percentage ).height( 7 );
					break;

				case 'poor':
					jQuery( ".cls .web-vitals-poor" ).width( metric.labeledBins[idx].percentage ).height( 7 );
					break;

				default:
					break;
				}
			}
			break;

		default:
			break;
	}
}

jQuery( document ).ready( function ( $ ) {
	generateReport();

	$( '#web-vitals-admin-container' ).on( "click", function ( event ) {
		let report_wrap = $( "#web-vitals-report-wrap" );

		if (report_wrap.is( ":hidden" )) {
			report_wrap.show();
		} else {
			report_wrap.hide();
		}
	} );

	$( document ).mouseup( function ( e ) {
		let container = $( "#wp-admin-bar-web_vitals_admin_bar" );

		// if the target of the click isn't the container nor a descendant of the container
		if (!container.is( e.target ) && container.has( e.target ).length === 0) {
			$( "#web-vitals-report-wrap" ).hide();
		}
	} );
} );
