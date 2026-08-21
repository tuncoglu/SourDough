import { summaryWithHardnessOverride, LocationData } from '../src/lib/location';

const base: LocationData = {
  location: {
    lat: 51.37,
    lon: -0.42,
    city: 'Elmbridge',
    country: 'United Kingdom',
    countryCode: 'gb',
    region: 'Surrey',
  },
  ambientTemp: 18,
  waterTemp: 15,
  hourlyForecast: null,
  hardness: {
    mgL: 280,
    classification: 'very hard',
    note: 'Thames Water — chalk aquifer',
    key: 'gb-england-se',
  },
  summary: '📍 Elmbridge, United Kingdom  │  🌡 Ambient 18°C  │  💧 Tap ~15°C  │  🧪 Water very hard (280 mg/L)',
};

describe('summaryWithHardnessOverride', () => {
  it('returns the auto-detected summary when no override is set', () => {
    expect(summaryWithHardnessOverride(base, 0)).toBe(base.summary);
  });

  it('applies the manual override value and classification', () => {
    const result = summaryWithHardnessOverride(base, 150);
    expect(result).toContain('slightly hard (150 mg/L)');
    expect(result).not.toContain('280 mg/L');
    // Location and weather parts stay intact
    expect(result).toContain('Elmbridge');
    expect(result).toContain('Ambient 18°C');
  });

  it('formats temperatures in imperial when requested', () => {
    const result = summaryWithHardnessOverride(base, 150, 'imperial');
    expect(result).toContain('64°F'); // 18°C
  });
});
