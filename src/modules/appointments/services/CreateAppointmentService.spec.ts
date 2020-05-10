import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 11),
      provider_id: '24332432',
      user_id: '24332432',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('24332432');
  });

  it('should not be able to create two appointments on the same schedule', async () => {
    const appointmentDate = new Date();

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '24332432',
      user_id: '24332432',
    });

    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '24332432',
        user_id: '24332432',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
