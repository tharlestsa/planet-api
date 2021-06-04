import json
from planet import api
from planet.api import filters
from sys import stdout

aoi = {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -49.15508508682251,
              -6.799785738707843
            ],
            [
              -49.15341138839722,
              -6.802438420240793
            ],
            [
              -49.14560079574585,
              -6.796728212107513
            ],
            [
              -49.14731740951538,
              -6.79427791542898
            ],
            [
              -49.15508508682251,
              -6.799785738707843
            ]
          ]
        ]
}

# will pick up api_key via environment variable PL_API_KEY
# but can be specified using `api_key` named argument
client = api.ClientV1()

# build a query using the AOI and
# a cloud_cover filter that excludes 'cloud free' scenes
query = filters.and_filter(
    filters.geom_filter(aoi),
    filters.range_filter('cloud_cover', lt=.1),
    filters.range_filter('quality_category', 'standard'),
    filters.date_range('acquired', gt=1985, lt=2021)
)

# build a request for only PlanetScope imagery
request = filters.build_search_request(
    query, item_types=['PSScene4Band']
)

# if you don't have an API key configured, this will raise an exception
result = client.quick_search(request)

# items_iter returns a limited iterator of all results. behind the scenes,
# the client is paging responses from the API
for item in result.items_iter(limit=None):
    # props = item['properties']
    # stdout.write('{0},{cloud_cover},{acquired}\n'.format(item['id'], **props))

    print(json.dumps(item, indent=2))