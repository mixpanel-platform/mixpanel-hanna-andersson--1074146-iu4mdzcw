// Import React & React's render() method
import React from 'react';
import {render} from 'react-dom';

/*
	-- MultiTouchAttribution --

	A three-column table showing customer journeys across UTM channels,
	grouping channel sequences together and showing resulting conversion amounts & Value

	|______COLUMN 1______|______COLUMN 2______|______COLUMN 3______|
	|   (Channel Path)   | (# of Conversions) | ($ from Conversion)|
*/

/* PROPS:
	'attributionList':
		Type: Array
		Array of attribution events, each are objects of the form
			{
				key:[
						"Some Attribution Source A",
						"Some Attribution Source B",
						...
						...
					],
				value: {
						count: [Number],
						revenue: [Number]
				} 
			}
*/

class MultiTouchAttribution extends React.Component {

	// Insert CSS transitions for hovering on table rows
	componentDidMount() {
		var animationStyle = document.getElementById('animationCSS');

		animationCSS.innerHTML = "			\
			.table-row {					\
				transition: all 0.15s;		\
			}								\
											\
			.table-row:hover {				\
				background-color: #f5f5f5;	\
			}								\
		";
	}

	render() {
		/////    CSS    /////
		var trStyle = {
			borderBottom: '#e0e0e0 2px solid'
		}

		var tdStyle = {
			padding: '18px'
		}

		var thStyle = {
			padding: '8px',
			minWidth: '200px'
		}

		var tdNumberStyle = {
			padding: '18px',
			textAlign: 'center'
		}

		// Iterate over attribution flows list, create table row elements
		var attributionList = this.props.attributionList;
		var tableRows = [];
		for(var i = 0; i < attributionList.length; i++) {
			
			var sequence = attributionList[i].key;
			var count = attributionList[i].value.count.toLocaleString();
			var revenue = attributionList[i].value.revenue.toLocaleString();

			tableRows.push(
				<tr style={trStyle} className="table-row">
					<td style={tdStyle}><AttributionSequence sequence={sequence} /></td>
					<td style={tdNumberStyle}>{count}</td>
					<td style={tdNumberStyle}>${revenue}</td>
				</tr>
			);
		}

		return(
			<div>
				<table>
						<colgroup span="3"></colgroup>
						<tr style={trStyle}>
							<th style={thStyle}>Attribution Channel Path</th>
							<th style={thStyle}>Number of Conversions</th>
							<th style={thStyle}>Total Revenue</th>
						</tr>
						{tableRows}
				</table>
			</div>
		);
	}
}

export default MultiTouchAttribution;


/*
	-- AttributionSequence --

	Color-coded Attribution sequences
*/
/* PROPS:
	'sequence':
		Type: Array of Strings representing a customer journey
		across multiple attribution sources
*/

class AttributionSequence extends React.Component {

	render() {
		/////     CSS     /////
		var styleMapping = {
			"Facebook": {
				backgroundColor: '#495d88',
			},
			"Twitter": {
				backgroundColor: '#55baec',
			},
			"Email": {
				backgroundColor: '#82bf91'
			},
			"Google AdWords": {
				backgroundColor: '#c94547',
			},
			"Organic Search": {
				backgroundColor: '#d6c25c'
			},
			"Referral": {
				backgroundColor: '#b78cd8'
			}
		}

		// Style applicable to ALL attribution elements
		var generalStyle = {
			padding: '4px 7px 4px 7px',
			borderRadius: '3px',
			color: 'white'
		}

		// Style '>' arrows that direct customer Journey
		var arrowStyle = {
			padding: '0px 6px 0px 6px',
			color: '#bdbdbd',
			fontWeight: 'bold'
		}

		var sequenceChain = [];
		for (var i = 0; i < this.props.sequence.length; i++) {
			var attributionName = this.props.sequence[i];
			var attributionStyle = styleMapping[attributionName];

			// Merge attribution-specific style with general attribution style
			var mergedStyle = Object.assign({}, generalStyle, attributionStyle);

			sequenceChain.push(
				<span style={mergedStyle}>
					{attributionName}
				</span>
			);

			// Append '>' to link items together
			if (i < this.props.sequence.length - 1) {
				sequenceChain.push(<span style={arrowStyle}>></span>);
			}
		}

		return(
			<div>
				{sequenceChain}
			</div>
		);
	}
}