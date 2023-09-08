const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");
const { USERTYPES, USER_STATUS } = require("./../constant");

async function createTicket(req, res) {
  try {
    const ticketObj = req.body;

    ticketObj.reporter = req.userId;

    // Find a engineer in the DB and set ticketObj.assignee = userId;
    const engineerCount = await User.count({
      userType: USERTYPES.ENGINEER,
      userStatus: USER_STATUS.APPROVED,
    });
    const random = Math.floor(Math.random() * engineerCount);

    const assignee = await User.findOne({
      userType: USERTYPES.ENGINEER,
      userStatus: USER_STATUS.APPROVED,
    }).skip(random);

    ticketObj.assignee = assignee.userId;

    const ticket = await Ticket.create(ticketObj);

    res.send(ticket);
  } catch (ex) {
    res.status(500).send({
      message: `Error occured - ${ex.message}`,
    });
  }
}

async function getAllTickets(req, res) {
  // If the user is an admin, then return all tickets
  // If the user is an engineer, return tickets assigned to them
  // If the user is a customer, then return tickets created by them

  let filterObj = {};

  if (req.userType === USERTYPES.ENGINEER) {
    filterObj = { assignee: req.userId };
  } else if (req.userType === USERTYPES.CUSTOMER) {
    filterObj = { reporter: req.userId };
  }
  const tickets = await Ticket.find(filterObj);

  res.send(tickets);
}

async function getTicketById(req, res) {
  try {
    const ticket = await Ticket.findById(req.params.id);
    res.send(ticket);
  } catch (ex) {
    res.status(404).send({
      message: `Ticket with id ${req.params.id} not found`,
    });
  }
}

async function updateTicket(req, res) {
  const { id } = req.params;

  const ticket = await Ticket.findOne({ _id: id });

  if (
    ticket.assignee === req.userId ||
    ticket.reporter === req.userId ||
    req.userType === USERTYPES.ADMIN
  ) {
    const updatedTicket = await Ticket.findByIdAndUpdate(id, req.body);
    res.send(updatedTicket);
  } else {
    res.status(403).send({
      message:
        "Only the ticket reporter, or the assignee, or an admin can update the ticket",
    });
  }
}

module.exports = {
  createTicket,
  updateTicket,
  getAllTickets,
  getTicketById,
};
