// 1. Getting Extractor instance
const Extractor = require('./extractor');
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

// 2. Getting single values
console.log('*** Getting single values ***');

// 2.1.
extractor.setPath('data.count');
console.log(extractor.extractFrom(data).get());

// 2.2.
extractor.setPath('data.foo.bar.baz');
console.log(extractor.extractFrom(data).get());

// 2.3.
extractor.setPath('data.count');
let response = extractor.extractFrom(data);

if (response.has()) {
  console.log(response.get());
}

// 3. Getting arrays of values
console.log('\n*** Getting arrays of values ***');

// 3.1.
extractor.setPath('data.country_codes.[]');
console.log(extractor.extractFrom(data).get());

// 3.2.
extractor.setPath('data.foo.[].bar');
console.log(extractor.extractFrom(data).get());

// 3.3.
extractor.setPath('data.country_codes.[]');
response = extractor.extractFrom(data);

if (response.has()) {
  console.log(response.get());
}

// 4. More examples
console.log('\n*** More examples ***');

// 4.1.
extractor.setPath('data.countries.[]');
console.log(extractor.extractFrom(data).get());

// 4.2.
extractor.setPath('data.countries.[].name');
console.log(extractor.extractFrom(data).get());

// 4.3.
extractor.setPath('data.countries.[].cities.[].name');
console.log(extractor.extractFrom(data).get());

// 5. Using filters
console.log('\n*** Using filters ***');

// 5.1.
extractor.setPath('data.countries.[population].name');
extractor.removeAllFilters();
extractor.setFilter('population', (item) => {
  return (item.population > 300000000);
});
console.log(extractor.extractFrom(data).get());

// 5.2.
extractor.setPath('data.countries.[].cities.[city_name].name');
extractor.removeAllFilters();
extractor.setFilter('city_name', (item) => {
  return (item.name[0] === 'S');
});
console.log(extractor.extractFrom(data).get());

// 5.3.
extractor.setPath('data.countries.[country_population].cities.[city_population]');
extractor.removeAllFilters();
extractor.setFilter('country_population', (item) => {
  return (item.population > 1000000000);
});
extractor.setFilter('city_population', (item) => {
  return (item.population > 20000000);
});
console.log(extractor.extractFrom(data).get());