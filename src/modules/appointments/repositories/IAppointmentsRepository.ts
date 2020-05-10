import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindMonthlyPerProviderDTO from '../dtos/IFindMonthlyPerProviderDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findMonthlyPerProvider(
    data: IFindMonthlyPerProviderDTO,
  ): Promise<Appointment[]>;
}
