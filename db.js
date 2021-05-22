const Sequelize = require('sequelize');
const { STRING } = Sequelize;

const db = new Sequelize('postgres://localhost:5432/acme_club',{logging:false});

const Facility = db.define('facility', {
    fac_name: {
        type: STRING,
        allowNull: false,
        unique: true
    }
})

const Member = db.define('member', {
    id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4
    },
    name: {
        type: STRING
    }
})

const Booking = db.define('booking', {
    startTime: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
    },
    endTime: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
    }
})


Member.belongsTo(Member, {as: 'sponsor'});
Member.hasMany(Member, {foreignKey: 'sponserId'});

Booking.belongsTo(Facility);
Facility.hasMany(Booking);
Booking.belongsTo(Member);
Member.hasMany(Booking);

const seed = async() => {
    await db.sync({ force:true });

    const [tennis_courts, movie_theater, events_hall, hank, beatrice, ludwig] =
    await Promise.all([
        Facility.create({fac_name: 'tennis_courts'}),
        Facility.create({fac_name: 'movie_theater'}),
        Facility.create({fac_name: 'events_hall'}),
        Member.create({name: 'hank'}),
        Member.create({name: 'beatrice'}),
        Member.create({name: 'ludwig'})
    ]);

    hank.sponsorId = beatrice.id;

    await Promise.all([
        Booking.create({
            startTime: '2021-12-04 10:12:12',
            endTime: '2021-12-04 12:12:12',
            facilityId: tennis_courts.id,
            memberId: ludwig.id
        }),
        hank.save()
    ])

    console.log('Database Synchronized and Seeded')
}

module.exports = {
    seed, 
    models: {
        Facility,
        Member,
        Booking
    }
}