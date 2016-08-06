if (Meteor.isServer) {
var snapshot = [];
var request = {
	url: 'https://www.google.com/finance?',
	output: 'json',
	start: 0,
	num: 5000,
	noIL: 1,
	currency: 'AUD',
	exchange: 'ASX',
	parameters : [
	'last_price',
	'earnings_per_share',
	'change_today_percent',
	'high_52week',
	'low_52week',
	'price_change_52week',
	'average_50day_price',
	'average_150day_price',
	'average_150day_price',
	'average_200day_price',
	'price_change_13week',
	'price_change_26week',
	'market_cap',
	'pe_ratio',
	'forward_pe_1year',
	'dividend_recent_quarter',
	'dividend_next_quarter',
	'dividend_per_share',
	'dividend_next_year',
	'dividend_per_share_trailing_12months',
	'dividend_yield',
	'dividend_recent_year',
	'book_value_per_share_year',
	'cash_per_share_year',
	'current_assets_to_liabilities_ratio_year',
	'longterm_debt_to_assets_year',
	'longterm_debt_to_assets_quarter',
	'total_debt_to_assets_year',
	'total_debt_to_assets_quarter',
	'longterm_debt_to_equity_year',
	'longterm_debt_to_equity_quarter',
	'total_debt_to_equity_year',
	'total_debt_to_equity_quarter',
	'interest_coverage_year',
	'return_on_investment_trailing_12months',
	'return_on_investment_5years',
	'return_on_investment_year',
	'return_on_assets_trailing_12months',
	'return_on_assets_5years',
	'return_on_assets_year',
	'return_on_equity_trailing_12months',
	'return_on_equity_5years',
	'return_on_equity_year',	
	'beta',
	'shares_floating',
	'percent_institutional_held',
	'volume',
	'average_volume',
	'gross_margin_trailing_12months',
	'ebitd_margin_trailing_12months',
	'operating_margin_trailing_12months',
	'net_profit_margin_percent_trailing_12months',
	'net_income_growth_rate_5years',
	'revenue_growth_rate_5years',
	'revenue_growth_rate_10years',
	'eps_growth_rate_5years',
	'eps_growth_rate_10years'
	]
};

function requestBuilder(request) {
	var string;
	var requestURL;
	var parameter;
	for (var i = request.parameters.length - 1; i >= 0; i--) {
		parameter = "+%26+%28" + request.parameters[i] + "+%3E%3D+" + -99999999999 + "%29";
		requestURL = request.url + "output=" + request.output + "&start=" + request.start + "&num=" + request.num + "&noIL=" + request.noIL + "&q=[currency%20%3D%3D%20%22" + request.currency + "%22%20%26%20%28exchange%20%3D%3D%20%22" + request.exchange + "%22%29" + parameter + "]&restype=company&ei=Y4i7VrnsN8OI0ASdrYTABQ";
		requestArray.push(requestURL);
	}	
}

var requestArray = [];

requestBuilder(request);


function assign(object, source) {
  Object.keys(source).forEach(function(key) {
    object[key] = source[key];
  });
}

function getIndicators() {
	var data = {};
	for (var i = requestArray.length - 1; i >= 0; i--) {
		data = {};
		HTTP.get(requestArray[i], function (error, result) {
			var results = eval("(" + result.content + ")");
			assign(data, {['date'] : new Date().toJSON().slice(0,10)})
			assign(data, {['indicator'] : results.searchresults[0].columns[0].field})
			for (var i = results.searchresults.length - 1; i >= 0; i--) {
				assign(data, {[results.searchresults[i].ticker] : results.searchresults[i].columns[0].value});
			}
					console.log('finished grabbing ' + results.searchresults[0].columns[0].field);	
			DataFrame.insert(data, function (error, result) {
				if (error) {
						console.log(error);
				} else {
					console.log('saved ' + results.searchresults[0].columns[0].field);
				}
			})
		});
	}
}

SyncedCron.add({
  name: 'Grab indicators from google finance.',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('at 11:05 pm every weekday');
  },
  job: function() {
    getIndicators();
  }
});

SyncedCron.start();


  Meteor.methods({
    getIndicators: function () {
		  getIndicators();
      return console.log(Date.now() + ' Indicators grab started.');
    },
  });
}
