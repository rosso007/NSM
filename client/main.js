if (Meteor.isClient) {
  // This code only runs on the client
/*  Template.requestData.events({
    "click .getIndicators": function () {
            Meteor.call('getIndicators',function (error,result) {});
        },
        "click .downloadData": function () {
            downloadData(inds);
        }                       
    });*/

    function downloadData(inds) {
        var data;
        for (var i = inds.length - 1; i >= 0; i--) {
            data = DataFrame.find({indicator : inds[i]}, {fields: {_id: 0, indicator: 0}}, {sort: {date: 1}}).fetch();
            data = parseData(data);
            downloadCSV(inds[i], data);
        }

    };

function convertArrayOfObjectsToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

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
        var data, filename, link;

        var csv = convertArrayOfObjectsToCSV({
            data: csvData
        });
        if (csv == null) return;

        filename = inds +'.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }

function parseData(data) {
    var object = {};
    for (var i = data.length - 1; i >= 0; i--) {
        object = data[i];
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                object[key] = object[key].replace(",","");
            }
         }            
    }
    return data 
}

    var inds = [
    "EPS",
    "QuoteLast",
    "High52Week",
    "Low52Week",
    "QuotePercChange",
    "Price52WeekPercChange",
    "Price50DayAverage",
    "Price150DayAverage",
    "Price200DayAverage",
    "Price13WeekPercChange",
    "Price26WeekPercChange",
    "DividendRecentQuarter",
    "MarketCap",
    "PE",
    "ForwardPE1Year",
    "DPSRecentYear",
    "DividendNextQuarter",
    "DividendPerShare",
    "IAD",
    "Dividend",
    "DividendYield",
    "BookValuePerShareYear",
    "LTDebtToAssetsYear",
    "CashPerShareYear",
    "TotalDebtToAssetsYear",
    "CurrentRatioYear",
    "LTDebtToAssetsQuarter",
    "TotalDebtToAssetsQuarter",
    "LTDebtToEquityYear",
    "LTDebtToEquityQuarter",
    "AINTCOV",
    "TotalDebtToEquityYear",
    "TotalDebtToEquityQuarter",
    "ReturnOnInvestmentTTM",
    "ReturnOnInvestmentYear",
    "ReturnOnInvestment5Years",
    "ReturnOnAssetsTTM",
    "ReturnOnAssetsYear",
    "ReturnOnEquityTTM",
    "ReturnOnAssets5Years",
    "ReturnOnEquity5Years",
    "ReturnOnEquityYear",
    "Beta",
    "Float",
    "Volume",
    "InstitutionalPercentHeld",
    "EBITDMargin",
    "AverageVolume",
    "GrossMargin",
    "OperatingMargin",
    "NetIncomeGrowthRate5Years",
    "RevenueGrowthRate5Years",
    "RevenueGrowthRate10Years",
    "EPSGrowthRate5Years",
    "NetProfitMarginPercent",
    "EPSGrowthRate10Years"
]

}