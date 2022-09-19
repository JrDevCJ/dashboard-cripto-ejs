// Function to reload table data
const reloadTable = ( ) => {

  clearTable(recentTradesTable);

  axios.get(baseUrl + 'BTC-BRL/trades')
  .then(response => {

    response.data.forEach(order => {

      let row = `<td>${order.tid}</td>`
        + `<td>${formatToDateString(order.date) }</td>`
        + `<td>${formatCurrency(order.price)}</td>`
        + `<td>${order.amount}</td>`
        + `<td><span class="status ${order.type === 'buy' ? 'buyStatus': 'sellStatus'}">${order.type}</span></td>`;

      insertRowInTable(row);

    });

  }).catch(error => {
    console.log(error);
    insertRowInTable('<td>No records found.</td>');
  });
}

// Function to clear the table
function clearTable (table) {
  const rowCount = table.rows.length;
  for (let i = rowCount - 1; i > 0; i--) {
      table.deleteRow(i);
  }
}

// Function to insert row in table
function insertRowInTable(dataRow){
  const tbodyRef  = recentTradesTable.getElementsByTagName('tbody')[0];
  const row = tbodyRef.insertRow();
  row.innerHTML = dataRow;
}

// Function to
function formatCurrency(value){
  value = parseFloat(value);
  return value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL', maximumFractionDigits: 2});
}

// Function to format unix_timestamp in string date "DD-MM-YYYY HH:MM:SS"
function formatToDateString(unix_timestamp) {

  const date = new Date(unix_timestamp * 1000);

  return (
    [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('-') + ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')
  );
}

// Function to format unix_timestamp in string date "MM-YYYY"
function formatToDateStringShort(unix_timestamp) {

  const date = new Date(unix_timestamp * 1000);

  return (
    [ padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('-')
  );
}

// Function to add pad in string
function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

// Function to generate LineChart
function ganerateLineChart(idChart, labels, values){

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'BitCoin',
        data: values,
        borderColor: "#5f4b8b",
        backgroundColor: "#b76ba3",
        fill: false,
      },

    ]
  };

  const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false,
          text: 'Line Chart'
        }
      },
      scales: {
        y: {
          min: 0,
          max: 500000,
        }
      }
    },
  };

  const myChart = new Chart(idChart, config);
}

// Function to reload the chart
const reloadDataChart = ( ) => {

  axios.get(baseUrl + 'BTC-BRL/candles')
  .then(response => {

    const candles = response.data;
    const labels  = candles.date.map(date => { return formatToDateStringShort(date)});
    const yValues = candles.close;

    ganerateLineChart("myChart", labels, yValues);

  }).catch(error => {
    console.log(error);
  });
}

// Get base url
const baseUrl = window.location + "coins/";
// Get trades table id
const recentTradesTable = document.body.querySelector('#recentTrades');

// Call function that reloads chart
reloadDataChart();
// Call function that reloads chart
reloadTable();
