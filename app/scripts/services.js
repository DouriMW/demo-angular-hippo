app.service('Products', ['$http', '$q', function($http, $q)
{
	return {
		items: [],
		sortOptions:
		[{
			name: 'Rating',
			command: 'hippogogreen:rating',
			property: 'rating'
		},
		{
			name: 'Price',
			command: 'hippogogreen:price',
			property: 'price'
		}],
		orderOptions:
		[{
			name: 'asc',
			command: 'ascending',
			reverse: true
		},
		{
			name: 'desc',
			command: 'descending',
			reverse: false
		}],

		/**
		* Fetch all products
		*/
		fetchAll: function (sortOption, orderOption)
		{
			// fetch products
			var ref = this;
			ref.items.length = 0;

			var url = 'http://www.demo.onehippo.com/restapi/topproducts?_type=json&sortby=' + encodeURIComponent(sortOption.command) + '&sortdir=' + orderOption.command + '&max=9999999';

			var d = $q.defer();
			$http.get(url).success(function(data, status)
			{
				// fetch detailed info
				for (var i = data.length - 1; i >= 0; i--)
				{
					ref.fetchOne(data[i].productLink).then(function(info, status)
					{
						ref.items.push(info.data);

						if (ref.items.length == data.length)
						{
							d.resolve(data);
							return d.promise;
						}
					});
				}
			});
		},

		/**
		* Fetch details for one product
		*/
		fetchOne: function(productLink)
		{
			var d = $q.defer();
			var url = productLink + '?_type=json';
			$http.get(url).then(function(data, status)
			{
				d.resolve(data);
			});

			return d.promise;
		}
	}

}]);