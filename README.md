## Contents  
1. [Creating Extractor instance and test data](#p1)  
2. [Getting single values](#p2)  
2.1. [... if path exists](#p2_1)  
2.2. [... if path doesn't exist](#p2_2)  
2.3. [... with checking of path existence](#p2_3)  
3. [Getting arrays of values](#p3)  
3.1. [... if path exists](#p3_1)  
3.2. [... if path doesn't exist](#p3_2)  
3.3. [... with checking of path existence](#p3_3)  
4. [More examples](#p4)  
4.1. [Getting of array elements](#p4_1)  
4.2. [Getting a defined property of array elements (objects)](#p4_2)  
4.3. [Getting a defined property of array elements (objects) that are deeply nested](#p4_3)  
5. [Using filters](#p5)  
5.1. [Getting names of countries with population bigger than 300 millions](#p5_1)  
5.2. [Getting names of cities where name starts with ‘S’](#p5_2)  
5.3. [Getting cities with population bigger than 20 millions in countries with population bigger than 1 billion](#p5_3)  

<a name="p1"><h4>1. Creating Extractor instance and test data</h4></a>

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

<a name="p2"><h4>2. Getting single values</h4></a>

<a name="p2_1"><h6>2.1. ... if path exists</h6></a>
```js
extractor.setPath('data.count');
console.log(extractor.extractFrom(data).get());

// 4
```

<a name="p2_2"><h6>2.2. ... if path doesn't exist</h6></a>
```js
extractor.setPath('data.foo.bar.baz');
console.log(extractor.extractFrom(data).get());

// undefined
```

<a name="p2_3"><h6>2.3. ... with checking of path existence</h6></a>
```js
extractor.setPath('data.count');
let response = extractor.extractFrom(data);

if (response.has()) {
  console.log(response.get());
}

// 4
```

<a name="p3"><h4>3. Getting arrays of values</h4></a>

<a name="p3_1"><h6>3.1.  ... if path exists</h6></a>
```js
extractor.setPath('data.country_codes.[]');
console.log(extractor.extractFrom(data).get());

// ['AU', 'BR', 'CN', 'US']
```

<a name="p3_2"><h6>3.2. ... if path doesn't exist</h6></a>
```js
extractor.setPath('data.foo.[].bar');
console.log(extractor.extractFrom(data).get());

// []
```

<a name="p3_3"><h6>3.3. ... with checking of path existence</h6></a>
```js
extractor.setPath('data.country_codes.[]');
response = extractor.extractFrom(data);

if (response.has()) {
  console.log(response.get());
}

// ['AU', 'BR', 'CN', 'US']
```

<a name="p4"><h4>4. More examples</h4><a>

<a name="p4_1"><h6>4.1. Getting of array elements</h6></a>
```js
extractor.setPath('data.countries.[]');
console.log(extractor.extractFrom(data).get());

// [ { name: 'Australia', population: 24641662, cities: [ ... ] },
// { name: 'Brazil', population: 211243220, cities: [ ... ] },
// { name: 'China', population: 1388232693, cities: [ ... ] },
// { name: 'United States', population: 326474013, cities: [ ... ] } ]
```

<a name="p4_2"><h6>4.2. Getting a defined property of array elements (objects)</h6></a>
```js
extractor.setPath('data.countries.[].name');
console.log(extractor.extractFrom(data).get());

// [ 'Australia', 'Brazil', 'China', 'United States' ]
```

<a name="p4_3"><h6>4.3. Getting a defined property of array elements (objects) that are deeply nested</h6></a>
```js
extractor.setPath('data.countries.[].cities.[].name');
console.log(extractor.extractFrom(data).get());

// [ 'Sydney', 'Melbourne', 'Canberra', 'São Paulo',
// 'Rio de Janeiro', 'Salvador', 'Shanghai', 'Beijing',
// 'Guangzhou', 'New York', 'Los Angeles', 'Chicago' ]
```

<a name="p5"><h4>5. Using filters</h4></a>

<a name="p5_1"><h6>5.1. Getting names of countries with population bigger than 300 millions</h6></a>
```js
extractor.setPath('data.countries.[population].name');
extractor.removeAllFilters();
extractor.setFilter('population', (item) => {
  return (item.population > 300000000);
});
console.log(extractor.extractFrom(data).get());

// [ 'China', 'United States' ]
```

<a name="p5_2"><h6>5.2. Getting names of cities where name starts with 'S'</h6></a>
```js
extractor.setPath('data.countries.[].cities.[city_name].name');
extractor.removeAllFilters();
extractor.setFilter('city_name', (item) => {
  return (item.name[0] === 'S');
});
console.log(extractor.extractFrom(data).get());

// [ 'Sydney', 'São Paulo', 'Salvador', 'Shanghai' ]
```

<a name="p5_3"><h6>5.3. Getting cities with population bigger than 20 millions in countries with population bigger than 1 billion</h6></a>
```js
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
