const express = require('express');
const { seed, models: {Facility, Member, Booking} } = require('./db');

const app = express();

app.get('/api/facilities', async(req, res, next) => {
    try{
        res.send(await Facility.findAll())
    } catch(err) {
        next(err);
    }
})

app.get('/api/members', async(req, res, next) => {
    try{
        res.send(await Member.findAll(
            {
                include: 
                {
                    model: Member,
                    as: 'sponsor'
                },
                Member
            }
        ))
    } catch(err) {
        next(err);
    }
})

app.get('/api/bookings', async(req, res, next) => {
    try{
        res.send(await Booking.findAll())
    } catch(err) {
        next(err);
    }
})

const init = async() => {
    try{
        await seed();

        const PORT = 1337;
        app.listen(PORT, () => console.log(`Server listening on Port: ${PORT}`))
    } catch (err) {
        console.log(err);
    }
}

init();