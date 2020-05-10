import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list a providers month availability', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      date: new Date(2020, 3, 9, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      date: new Date(2020, 3, 9, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      date: new Date(2020, 4, 10, 10, 0, 0),
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'provider_id',
      year: 2020,
      month: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 8, available: true },
        { day: 9, available: false },
        { day: 10, available: false },
        { day: 11, available: true },
      ]),
    );
  });
});
