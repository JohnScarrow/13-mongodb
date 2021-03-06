'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Car = require('../model/car.js');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');


mongoose.Promise = Promise;
require('../server.js');

const url = `http://localhost:${PORT}`;
const exampleCar = {
    name: 'test car name'
}

describe('Car Routes', function() {
    describe('POST: /api/car', function() {
        describe('with a valid req body', function() {
            after(done => {
                if (this.tempCar) {
                    Car.remove({})
                        .then(() => done())
                        .catch(done);
                    return;
                }
                done();
            });

            it('should return a car', done => {
                request.post(`${url}/api/car`)
                    .send(exampleCar)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.status).to.equal(200);
                        expect(res.body.name).to.equal('test car name');
                        this.tempCar = res.body;
                        done();
                    });
            });
        });
    });

    describe('GET: /api/car/:id', function() {
        describe('with a valid body', function() {
            before(done => {
                exampleCar.timestamp = new Date();
                new Car(exampleCar).save()
                    .then(car => {
                        this.tempCar = car;
                        done();
                    })
                    .catch(done);
            });

            after(done => {
                delete exampleCar.timestamp;
                if (this.tempCar) {
                    Car.remove({})
                        .then(() => done())
                        .catch(done);
                    return;
                }
                done();
            });

            it('should return a car', done => {
                request.get(`${url}/api/car/${this.tempCar._id}`)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.status).to.equal(200);
                        expect(res.body.name).to.equal('test car name');
                        done();
                    });
            });
        });
    });
});