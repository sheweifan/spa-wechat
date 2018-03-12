import mongoose, { Schema } from 'mongoose';

const TicketSchema = new mongoose.Schema({
  name: String,
  Ticket: String,
  expires_in: Number,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

TicketSchema.pre('save', function(next){
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  }else{
    this.meta.updateAt = Date.now();
  }

  next();
})

TicketSchema.statics = {
  async getTicket(){
    const Ticket = await this.findOne({
      name: 'ticket',
    }).exec();

    if(Ticket && Ticket.Ticket){
      Ticket.ticket = Ticket.Ticket;
    }

    return Ticket;
  },
  async saveTicket(data){
    let ticket = await this.findOne({
      name: 'ticket'
    }).exec();

    if(ticket){
      ticket.ticket = data.ticket;
      ticket.ticket = data.expires_in;
    }else{
      ticket = new Ticket({
        name: 'ticket',
        Ticket: data.ticket,
        expires_in: data.expires_in
      });

      await ticket.save();
    }

    return data;

  }
}
const Ticket = mongoose.model('Ticket', TicketSchema)

export default Ticket;