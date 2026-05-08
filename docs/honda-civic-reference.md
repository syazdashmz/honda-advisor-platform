# Honda Civic Reference

Source checked: Honda Malaysia Civic pages on 2026-05-08.

- https://www.honda.com.my/model/civic
- https://www.honda.com.my/model/civic/spec
- https://www.honda.com.my/model/civic/pricing

## Current Civic Price Reference

- Civic 1.5L E: RM133,900
- Civic 1.5L V: RM144,900
- Civic 1.5L RS: RM149,900
- Civic 2.0L e:HEV RS: RM167,900

Honda Malaysia notes the listed prices include 10% sales tax but exclude insurance, and final pricing may vary with selected exterior colors.

## Engine And Performance Reference

- 1.5L VTEC Turbo variants: 182PS, 240Nm, CVT
- Civic 2.0L e:HEV RS: electric motor output 184PS, 315Nm, e-CVT
- Civic 1.5L E / V / RS acceleration reference: 8.3 / 8.4 / 8.5 seconds for 0-100km/h
- Civic 2.0L e:HEV RS reference fuel consumption: 4.0L/100km
- Civic 2.0L e:HEV RS reference 0-100km/h: 7.9 seconds

## Dimension And Utility Reference

- Length: 4,681mm
- Width: 1,802mm
- Height: 1,415mm
- Wheelbase: 2,735mm
- Boot capacity: 497 litres

## Equipment Reference

- Honda SENSING: FCW, CMBS, LDW, LKAS, RDM, ACC, LSF, AHB, and LCDN
- Honda CONNECT: safety, security, and convenience features
- LED headlights and LED daytime running lights across listed variants
- Wheel sizes: 16-inch for E, 17-inch for V, 18-inch for RS and e:HEV RS
- Wireless Apple CarPlay and Android Auto connectivity listed across variants

## Website Data Applied

The project seed and existing-database migration now apply these details to:

- `car_models` for the Civic base record
- `car_variants` for Civic E, V, RS, and e:HEV RS
- `car_features` for Civic performance, safety, connected, styling, and hybrid-efficiency highlights
- `car_images` using local WebP images under `honda-advisor-angular/public/images/cars/civic/`

Always verify final prices, variant availability, color surcharges, insurance, stock, promotions, and official quotation rules with Honda Malaysia or the dealership before using the information for a customer quote.
