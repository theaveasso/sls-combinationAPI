import { APIGatewayProxyEvent } from 'aws-lambda';
import { formatJsonResp } from 'src/lib/apiGateway';

import axios from 'axios';

const handler = async (event: APIGatewayProxyEvent) => {
	try {
		const { queryStringParameters = {} } = event;
		const { currency } = queryStringParameters;

		if (!currency) {
			return formatJsonResp({
				statusCode: 400,
				data: {
					message: 'Missing currency query parameter',
				},
			});
		}

		const deals = await axios.get(
			'https://www.cheapshark.com/api/1.0/deals?upperPrice=25&pageSize=5'
		);

		const currencyData = await axios.get(
			`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/${currency}.json`
		);

		const currencyCoversion = currencyData.data[currency];

		const repricedDeals = deals.data.map((deal) => {
			const {
				title,
				storeID,
				salePrice,
				normalPrice,
				savings,
				steamRatingPercent,
				releaseDate,
			} = deal;

			return {
				title,
				storeID,
				steamRatingPercent,

				salePrice: salePrice * currencyCoversion,
				normalPrice: normalPrice * currencyCoversion,
				savingsPercentage: `${savings}%`,

				releaseDate: new Date(releaseDate * 1000).toDateString(),
			};
		});

		return formatJsonResp({
			data: repricedDeals,
		});
	} catch (err) {
		console.log('Error', err.message);
		return formatJsonResp({
			statusCode: 502,
			data: {
				message: err.message,
			},
		});
	}
};

export default handler;
