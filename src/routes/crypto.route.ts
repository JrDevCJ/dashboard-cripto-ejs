import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import MercadoBitCoinApi from "../services/mercadobitcoin.api.service";

const route = Router();

// Route to get coin data
route.get("/coins/:coin", async function (req, res, next) {
  const { coin } = req.params;

  const data = await getDataCoins(coin);

  res.status(StatusCodes.OK).send(data);
});

// Route to get last 10 trades
route.get("/coins/:coin/trades", async function (req, res, next) {
  const { coin } = req.params;

  await MercadoBitCoinApi.get(`${coin}/trades`)
    .then(response => {
      const data = response.data;
      const lenght = Object.keys(data).length; // Get object size

      const last10Data = data.slice(lenght - 10, lenght); // Get last 10 records

      // Sort object in descending order
      last10Data.sort(function (x: any, y: any) {
        return y.date - x.date;
      });

      res.status(StatusCodes.OK).send(last10Data);
    }).catch(err => {
      console.log(err);
      res.status(StatusCodes.BAD_GATEWAY).json(err.message);
    });
});

// Route to get last 12 months candles
route.get("/coins/:coin/candles", async function (req, res, next) {
  const { coin } = req.params;
  const resolution :string = "1M";
  const from: Number = convertStringDateToUnixTimestamp("2021-03-27 00:00:00");
  const to : Number = convertStringDateToUnixTimestamp("2022-03-27 23:59:59");

  await MercadoBitCoinApi.get("candles",
    {
      params: {
        symbol: coin,
        resolution: resolution,
        from: from,
        to: to
      }
    })
    .then(response => {
      const data = response.data;

      const candles = { close: data.c, date: data.t };

      res.status(StatusCodes.OK).json(candles);
    }).catch(err => {
      res.status(StatusCodes.BAD_GATEWAY).json(err.message);
      console.log(err);
    });
});

// Route to Index - dashboard page
route.get("/", async function (req, res, next) {
  const coins = [
    { name: "Bitcoin", abbreviation: "BTC-BRL", lastValue: "0.0", logo: "icon-bitcoin.svg" },
    { name: "Ethereum", abbreviation: "ETH-BRL", lastValue: "0.0", logo: "icon-ethereum.svg" },
    { name: "Litecoin", abbreviation: "LTC-BRL", lastValue: "0.0", logo: "icon-litecoin.svg" },
    { name: "XRP", abbreviation: "XRP-BRL", lastValue: "0.0", logo: "icon-xrp.svg" }
  ];

  await Promise.all(
    coins.map(async (coin) => {
      const data = await getDataCoins(coin.abbreviation);
      coin.lastValue = formatCurrency(data.last);
    })
  );

  res.render("pages/index", { coins });
});

// ***************** UTILS FUNCTIONS ****************
const getDataCoins = async (coin: any) => {
  return await MercadoBitCoinApi.get("tickers", { params: { symbols: coin } })
    .then(response => response.data[0])
    .catch(err => { console.log(err.message); return err });
};

const formatCurrency = (value:string):string => {
  return parseFloat(value)
    .toLocaleString("pt-br", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });
};

const convertStringDateToUnixTimestamp = (value : string):number => {
  return Math.floor(new Date(value).getTime() / 1000);
};

// const testeConvertDateToUnixTimestamp = () => {
//   const unixTimestampFrom = convertStringDateToUnixTimestamp("2021-03-27 00:00:00");
//   const unixTimestampTo = convertStringDateToUnixTimestamp("2022-03-27 23:59:59");

//   console.log("unixTimestampFrom = " + unixTimestampFrom);
//   console.log("unixTimestampTo = " + unixTimestampTo);

//   const dateFrom = new Date(unixTimestampFrom * 1000);
//   const dateTo = new Date(unixTimestampTo * 1000);

//   console.log("dateFrom = " + dateFrom);
//   console.log("dateTo = " + dateTo);
// };

export default route;
