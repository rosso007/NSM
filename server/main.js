if (Meteor.isServer) {
  let requestArray = [];
  let asxRequest = {
    url: 'https://www.google.com/finance?',
    output: 'json',
    start: 0,
    num: 5000,
    noIL: 1,
    currency: 'AUD',
    exchange: 'ASX',
    parameters: [
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
      'eps_growth_rate_10years',
    ],
  };

  function requestBuilder(request) {
    let requestURL;
    let parameter;
    for (let i = request.parameters.length - 1; i >= 0; i--) {
      parameter = '+%26+%28' +
      request.parameters[i] +
      '+%3E%3D+' +
      -99999999999 +
      '%29';
      requestURL = request.url +
      'output=' +
      request.output +
      '&start=' +
      request.start +
      '&num=' +
      request.num +
      '&noIL=' +
      request.noIL +
      '&q=[currency%20%3D%3D%20%22' +
      request.currency +
      '%22%20%26%20%28exchange%20%3D%3D%20%22' +
      request.exchange +
      '%22%29' +
      parameter +
      ']&restype=company&ei=Y4i7VrnsN8OI0ASdrYTABQ';
      requestArray.push(requestURL);
    }
  }

  requestBuilder(asxRequest);

  function assign(object, source) {
    Object.keys(source).forEach(function keys(key) {
      object[key] = source[key];
    });
  }

  function numberNormaliser(value) {
    let valueM;
    let newValue;
    if (value.includes('M')) {
      valueM = value.replace('M', '');
      newValue = valueM * 1000000;
      return newValue;
    } else if (value.includes('B')) {
      valueM = value.replace('B', '');
      newValue = valueM * 1000000000;
      return newValue;
    }
    return value;
  }

  function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  }

  function getIndicators() {
    for (let i = requestArray.length - 1; i >= 0; i--) {
      let data = {};
      HTTP.get(requestArray[i], function requestResult(error, result) {
        let results = eval('(' + result.content + ')');
        let field = results.searchresults[0].columns[0].field;
        assign(data, {['date']: new Date().toJSON().slice(0, 10)});
        assign(data, {['indicator']: field});
        for (let p = results.searchresults.length - 1; p >= 0; p--) {
          let value = results.searchresults[p].columns[0].value;
          let ticker = results.searchresults[p].ticker;
          if (value !== '-') {
            if (value !== 'indicator' && value !== 'date') {
              let v = value.replace(',', '');
              let nV = numberNormaliser(v);
              let rNV = round(nV, 2);
              assign(data, {[ticker]: rNV});
            } else {
              assign(data, {[ticker]: value});
            }
          }
        }
        console.log('Added ' + field);
        if (i === 0) {console.log('Finishing grabbing all indicators.');}
        DataFrame.insert(data, function cb(err, ) {
          if (err) {
            console.log(err);
          }
        });
      });
    }
  }

  SyncedCron.add({
    name: 'Grab indicators from google finance.',
    schedule: function timeGetInds(parser) {
      // parser is a later.parse object
      return parser.text('at 11:05 pm every weekday');
    },
    job: function jobGetInds() {
      getIndicators();
    },
  });

/*  function downloadData(inds) {
    let allData = [];
    for (let i = inds.length - 1; i >= 0; i--) {
      let d = DataFrame.find(
        {indicator: inds[i]},
        {fields: {_id: 0, indicator: 0}},
        {sort: {date: 1}}).fetch();
      d = parseData(d);
      allData.push(downloadCSV(inds[i], d));
    }
    return allData;
  }

  function convertArrayOfObjectsToCSV(args) {
    let result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\r\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
  }

  function downloadCSV(inds, csvData) {
    let csvd = {};
    let csv = convertArrayOfObjectsToCSV({
      data: csvData,
    });
    if (csv === null) return;

    csvd.filename = inds + '.csv';

    if (!csv.match(/^data:text\/csv/i)) {
      csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    csvd.data =  encodeURI(csv);
    return csvd;
  }

  function parseData(data) {
    let object = {};
    for (let i = data.length - 1; i >= 0; i--) {
        object = data[i];
        for (let key in object) {
          if (object.hasOwnProperty(key)) {
            object[key] = object[key].replace(',', '');
          }
        }
    }
    return data;
  }*/

/*  let inds = [
    'EPS',
    'QuoteLast',
    'High52Week',
    'Low52Week',
    'QuotePercChange',
    'Price52WeekPercChange',
    'Price50DayAverage',
    'Price150DayAverage',
    'Price200DayAverage',
    'Price13WeekPercChange',
    'Price26WeekPercChange',
    'DividendRecentQuarter',
    'MarketCap',
    'PE',
    'ForwardPE1Year',
    'DPSRecentYear',
    'DividendNextQuarter',
    'DividendPerShare',
    'IAD',
    'Dividend',
    'DividendYield',
    'BookValuePerShareYear',
    'LTDebtToAssetsYear',
    'CashPerShareYear',
    'TotalDebtToAssetsYear',
    'CurrentRatioYear',
    'LTDebtToAssetsQuarter',
    'TotalDebtToAssetsQuarter',
    'LTDebtToEquityYear',
    'LTDebtToEquityQuarter',
    'AINTCOV',
    'TotalDebtToEquityYear',
    'TotalDebtToEquityQuarter',
    'ReturnOnInvestmentTTM',
    'ReturnOnInvestmentYear',
    'ReturnOnInvestment5Years',
    'ReturnOnAssetsTTM',
    'ReturnOnAssetsYear',
    'ReturnOnEquityTTM',
    'ReturnOnAssets5Years',
    'ReturnOnEquity5Years',
    'ReturnOnEquityYear',
    'Beta',
    'Float',
    'Volume',
    'InstitutionalPercentHeld',
    'EBITDMargin',
    'AverageVolume',
    'GrossMargin',
    'OperatingMargin',
    'NetIncomeGrowthRate5Years',
    'RevenueGrowthRate5Years',
    'RevenueGrowthRate10Years',
    'EPSGrowthRate5Years',
    'NetProfitMarginPercent',
    'EPSGrowthRate10Years',
  ];
*/

  SyncedCron.start();

  Meteor.methods({
    getIndicators: function getInds() {
      getIndicators();
      return 'Grabbing Indicators';
    },
/*    downloadData: function dlData() {
      downloadData(inds, function cb(result) {
        console.log(result.length);
        //return result;
      });
    },*/
    sendLogMessage: function sendLogMessage() {
      return 'Hello World';
    },
  });
}
