// Gather the data for example.com and display it
async function generateReport() {
	const wpWebVitals = JSON.parse( await AMP.getState( 'wpWebVitals' ) );
	const endpointUrl = 'https://chromeuxreport.googleapis.com/v1/records:queryRecord';
	const resp = await fetch( `${endpointUrl}?key=${wpWebVitals.cruxApiKey}`, {
		method: 'POST',
		body: JSON.stringify( {
			origin: wpWebVitals.currentURL
		} ),
	} );

	const json = await resp.json();

	if ( !resp.ok ) {
		throw new Error( json.error.message );
	}

	const labeledMetrics = labelMetricData( json.record.metrics );

	let wrapper = document.createElement( 'div' );
	wrapper.setAttribute( "id", "web-vitals-report-wrap" );
	wrapper.setAttribute( "class", "web-vitals-report-wrap-hidden" );
	document.body.appendChild( wrapper );

	// Display metric results
	for (const metric of labeledMetrics) {

		const metricEl = document.createElement( 'section' );

		const titleEl = document.createElement( 'h2' );
		titleEl.textContent = metric.acronym;

		const [descEl, barsEl] = createDescriptionAndBars( metric );

		metricEl.appendChild( titleEl );
		metricEl.appendChild( descEl );
		metricEl.appendChild( barsEl );
		document.getElementById( 'web-vitals-report-wrap' ).appendChild( metricEl );
	}
}

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

function createDescriptionAndBars( metric ) {
	let labeledBins = metric.labeledBins;

	const descEl = document.createElement( 'p' );
	// Example: 'good: 43.63%, needs improvement: 42.10%, poor: 14.27%'
	descEl.textContent = labeledBins
		.map( bin => `${bin.label}: ${bin.percentage.toFixed( 2 )}%` )
		.join( ', ' );

	let barsEl = document.createElement( 'div' );

	let class_name = metric.acronym.toLowerCase();

	let adminBarParent = document.createElement( 'div' );
	let adminBarClass = `web-vitals-admin-bar-${class_name}`;
	adminBarParent.classList.add( adminBarClass );
	adminBarParent.innerHTML = `<div class="web-vitals-good"></div>
	<div class="web-vitals-needs-improvement"></div>
	<div class="web-vitals-poor"></div>`;
	document.getElementById( 'web-vitals-admin-container' ).appendChild( adminBarParent );


	for (const bin of labeledBins) {
		const barEl = document.createElement( 'div' );
		// Reuse the label for the styling class, changing any spaces:  `needs improvement` => `needs-improvement`
		barEl.classList.add( `box-${bin.label.replace( ' ', '-' )}` );
		barsEl.appendChild( barEl );

		const classElem = document.getElementsByClassName( adminBarClass )[0];

		if ('good' === bin.label) {
			const elem = classElem.children[0];
			elem.style.width = bin.percentage + 'px' ;
			elem.style.height = '8px';
		} else if ('needs improvement' === bin.label) {
			const elem = classElem.children[1];
			elem.style.width = bin.percentage + 'px' ;
			elem.style.height = '8px';
		} else if ('poor' === bin.label) {
			const elem = classElem.children[2];
			elem.style.width = bin.percentage + 'px' ;
			elem.style.height = '8px';
		}
	}

	// Set the width of the bar columns based on metric bins
	// Ex: `grid-template-columns: 43.51% 42.26% 14.23%`;
	barsEl.style.gridTemplateColumns = labeledBins.map( bin => `${bin.percentage}%` ).join( ' ' );
	barsEl.classList.add( `grid-container` );

	return [descEl, barsEl];
}

generateReport();

document.getElementById( 'web-vitals-admin-container' ).addEventListener( 'click', ( event ) => {
	event.preventDefault();
	const wrapper = document.getElementById( 'web-vitals-report-wrap' );

	if (wrapper.hasAttribute('class')) {
		wrapper.removeAttribute( 'class' );
	} else {
		wrapper.setAttribute( 'class', 'web-vitals-report-wrap-hidden' );
	}
} );
