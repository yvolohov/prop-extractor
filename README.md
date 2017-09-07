#### 1. Getting Extractor instance

```js
const Extractor = require('prop-extractor');
let extractor = new Extractor();

let data = {
    countries: [
        {
            name: 'Australia',
            population: 24641662,
            cities: [
                {name: 'Sydney', population: 5029768},
                {name: 'Melbourne', population: 4725316},
                {name: 'Canberra', population: 435019}
            ]
        },
        {
            name: 'Brazil',
            population: 211243220,
            cities: [
                {name: 'São Paulo', population: 12038175},
                {name: 'Rio de Janeiro', population: 6498837},
                {name: 'Salvador', population: 2938092}
            ]
        },
        {
            name: 'China',
            population: 1388232693,
            cities: [
                {name: 'Shanghai', population: 24152700},
                {name: 'Beijing', population: 21700000},
                {name: 'Guangzhou', population: 14043500}
            ]
        },
        {
            name: 'United States',
            population: 326474013,
            cities: [
                {name: 'New York', population: 8537673},
                {name: 'Los Angeles', population: 3976322},
                {name: 'Chicago', population: 2704958}
            ]
        }
    ],
    country_codes: ['AU', 'BR', 'CN', 'US'],
    count: 4
};

```

#### 2. Getting single values

###### 2.1.
```js
// if path exists
extractor.setPath('data.count');
console.log(extractor.extractFrom(data).get());

// 4
```

###### 2.2.
```js
// if path doesn't exist
extractor.setPath('data.foo.bar.baz');
console.log(extractor.extractFrom(data).get());

// undefined
```

###### 2.3.
```js
// checking of path existence
extractor.setPath('data.count');
let response = extractor.extractFrom(data);

if (response.has()) {
  console.log(response.get());
}

// 4
```

#### 3. Getting arrays of values

###### 3.1.
```js
// if path exists
extractor.setPath('data.country_codes.[]');
console.log(extractor.extractFrom(data).get());

// ['AU', 'BR', 'CN', 'US']
```

###### 3.2.
```js
// if path doesn't exist
extractor.setPath('data.foo.[].bar');
console.log(extractor.extractFrom(data).get());

// []
```

###### 3.3.
```js
// checking of path existence
extractor.setPath('data.country_codes.[]');
response = extractor.extractFrom(data);

if (response.has()) {
  console.log(response.get());
}

// ['AU', 'BR', 'CN', 'US']
```

#### 4. More examples

###### 4.1.
```js
extractor.setPath('data.countries.[]');
console.log(extractor.extractFrom(data).get());

// [ { name: 'Australia', population: 24641662, cities: [ ... ] },
// { name: 'Brazil', population: 211243220, cities: [ ... ] },
// { name: 'China', population: 1388232693, cities: [ ... ] },
// { name: 'United States', population: 326474013, cities: [ ... ] } ]
```

###### 4.2.
```js
extractor.setPath('data.countries.[].name');
console.log(extractor.extractFrom(data).get());

// [ 'Australia', 'Brazil', 'China', 'United States' ]
```

###### 4.3.
```js
extractor.setPath('data.countries.[].cities.[].name');
console.log(extractor.extractFrom(data).get());

// [ 'Sydney', 'Melbourne', 'Canberra', 'São Paulo',
// 'Rio de Janeiro', 'Salvador', 'Shanghai', 'Beijing',
// 'Guangzhou', 'New York', 'Los Angeles', 'Chicago' ]
```

#### 5. Using filters

###### 5.1.
```js
// getting names of countries with population bigger than 300 millions
extractor.setPath('data.countries.[population].name');
extractor.removeAllFilters();
extractor.setFilter('population', (item) => {
  return (item.population > 300000000);
});
console.log(extractor.extractFrom(data).get());

// [ 'China', 'United States' ]
```

###### 5.2.
```js
// getting names of cities where name starts with 'S'
extractor.setPath('data.countries.[].cities.[city_name].name');
extractor.removeAllFilters();
extractor.setFilter('city_name', (item) => {
  return (item.name[0] === 'S');
});
console.log(extractor.extractFrom(data).get());

// [ 'Sydney', 'São Paulo', 'Salvador', 'Shanghai' ]
```

###### 5.3.
```js
// getting cities with population bigger than 20 millions
// in countries with population bigger than 1 billion
extractor.setPath('data.countries.[country_population].cities.[city_population]');
extractor.removeAllFilters();
extractor.setFilter('country_population', (item) => {
  return (item.population > 1000000000);
});
extractor.setFilter('city_population', (item) => {
  return (item.population > 20000000);
});
console.log(extractor.extractFrom(data).get());

// [ { name: 'Shanghai', population: 24152700 },
// { name: 'Beijing', population: 21700000 } ]
```
