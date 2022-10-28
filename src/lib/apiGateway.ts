type Props = {
	statusCode?: number;
	data?: {};
};

export const formatJsonResp = ({ statusCode = 200, data }: Props) => {
	return {
		statusCode,
		body: JSON.stringify({ data }),

		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
		},
	};
};
