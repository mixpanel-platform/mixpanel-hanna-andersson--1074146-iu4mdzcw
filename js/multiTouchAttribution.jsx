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
						"Some Attribution Source C",
						...
					],
				value: {
						count: [Number],
						revenue: [Number]
				} 
			}

	'reportNumber':
		Type: Number
		Mixpanel report number, used to create URLs to Explore feature in MP report
*/

class MultiTouchAttribution extends React.Component {

	// Insert CSS transitions for hovering on table rows or attribution links
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
			a {								\
				text-decoration: none		\
			}								\
			a:hover {						\
				text-decoration: underline	\
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
			padding: '14px 8px 14px 8px',
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
					<td style={tdStyle}><AttributionSequence sequence={sequence} reportNumber={this.props.reportNumber}/></td>
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
		Type: Array of Strings
		Represents a customer journey across multiple attribution sources

	'reportNumber':
		Type: Number
		Report number on Mixpanel
*/

class AttributionSequence extends React.Component {

	// Input the attribution names into the Explore URL to generate and open an Explore report
	generateExploreURL(sequence) {
		// Set up URL strings to load Explore when a user clicks an attribution
		var exploreURL = "https://mixpanel.com/report/" + this.props.reportNumber
		+ "/explore/#list/filter:(conjunction:and,filters:!((dropdown_tab_index:0,filter:(operand:'',operator:within,option:was,window_size:'90'),"
		+ "property:(name:'Complete%20Purchase',no_second_icon:!t,source:properties,type:behavioral),"
		+ "selected_property_type:behavioral,sub_event_property_filter_list_params:"
		+ "(conjunction:and,filters:!(";

		var exploreSuffix = ")),type:behavioral))),sort_order:descending,sort_property:'$last_seen',sort_property_type:datetime";

		//+ "(filter:(operand:Twitter,operator:in),property:UTM_Sources,selected_property_type:list,type:list),"
		//+ "(filter:(operand:Email,operator:in),property:UTM_Sources,selected_property_type:list,type:list)"

		// Append filters for each attribution property
		for (var i = 0; i < sequence.length; i++) {
			exploreURL += "(filter:(operand:" + sequence[i] + ",operator:in),property:UTM_Sources,selected_property_type:list,type:list)";
			if (i < sequence.length - 1) { exploreURL += "," };
		}
		exploreURL += exploreSuffix;
		return exploreURL;
	}

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
				backgroundColor: '#61ae74'
			},
			"Google AdWords": {
				backgroundColor: '#b95556',
			},
			"Organic Search": {
				backgroundColor: '#ab962b'
			},
			"Referral": {
				backgroundColor: '#b78cd8'
			}
		}

		// Style applicable to ALL attribution elements
		var generalStyle = {
			padding: '5px 7px 5px 7px',
			borderRadius: '3px',
			color: 'white'
		}

		// Style '>' arrows that direct customer Journey
		var arrowStyle = {
			padding: '0px 6px 0px 6px',
			color: '#bdbdbd',
			fontWeight: 'bold'
		}

		var exploreURL = this.generateExploreURL(this.props.sequence);

		var sequenceChain = [];
		for (var i = 0; i < this.props.sequence.length; i++) {
			var attributionName = this.props.sequence[i];
			var attributionStyle = styleMapping[attributionName];

			// Merge attribution-specific style with general attribution style
			var mergedStyle = Object.assign({}, generalStyle, attributionStyle);

			// Push attribution element into the array of other attributions in its flow
			sequenceChain.push(
				<a href={exploreURL} style={mergedStyle} target="new">
					{attributionName}
				</a>
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