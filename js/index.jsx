// Multi-Touch Attribution Display for Hanna Andersson

// Set Credentialss
MP.api.setCredentials('9b4f82b0d853dc32417d17f4f6847464');

import React from 'react';
import {render} from 'react-dom';
import MultiTouchAttribution from './multiTouchAttribution.jsx';


class App extends React.Component {

	// Initialize App with one state property, an array of top attribution flows
	constructor(props) {
		super(props);
		this.state = {
			topAttributions: [],
		}
	}

	// Run queries to pull data on multi-touch attribution,
	// stored as 'UTM_Sources' list property of the "Complete Purchase" event,
	// which also has a 'Total Charge' property for the purchase amount
	// Param: journeyCount - Type: Number - Max amount of journeys to return
	queryMTA(journeyCount) {
		var today = new Date();
		var d = today.getDay().toString();
		var m = (today.getMonth() + 1).toString();
		var y = today.getFullYear().toString();
		var todayString = y + '-' + m + '-' + d;

		var params = {
			from_date: '2016-07-01',
			to_date: todayString
		}

		var app = this;

		// Run JQL query
		MP.api.jql(function main() {
			return Events({
				from_date: params.from_date,
				to_date: params.to_date,
				event_selectors: [{event: 'Complete Purchase'}]
			})

			.groupBy(['properties.UTM_Sources'], function(accumulators, items) {
				var values = { count: 0, revenue: 0 };

				for (var i = 0; i < accumulators.length; i++) {
					values.count += accumulators[i].count;
					values.revenue += accumulators[i].revenue;
				}

				values.count += items.length;
				for (var i = 0; i< items.length; i++) {
					values.revenue += items[i].properties['Total Charge'];
				}
				return values;
			})
			}, params)

			.done(function(results) {
				// Get top [journeyCount] customer journeys by total revenue,
				// with the stipulation that the journey is only 2 or 3 steps
				var topAttributions = [];

				// Sort in descending order
				results.sort(function(a, b) {
					return b.value.revenue - a.value.revenue;
				});

				// Insert top journeys into array, set array to as part of app state
				topAttributions = [];
				for (var i = 0; i < results.length; i++) {
					var customerFlow = results[i].key;
					if (customerFlow.length >= 2 && customerFlow.length <= 3) {
						topAttributions.push(results[i]);
					}
					if (topAttributions.length >= journeyCount) {
						break;
					}
				}

				app.setState({ topAttributions: topAttributions });
			});
	}

	// When component loads, query for specified number of top attributions
	componentDidMount() {
		this.queryMTA(10);
	}

	render() {
		var bodyStyle = {
			fontFamily: 'Source Sans Pro, Helvetica'
		}

		return(
			<div style={bodyStyle}>
				<MultiTouchAttribution attributionList={this.state.topAttributions} />
			</div>
		);
	}
}

render(<App />, document.getElementById('root'));