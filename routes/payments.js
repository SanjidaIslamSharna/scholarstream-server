const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const verifyStudent = require('../middleware/verifyStudent');
const Application = require('../models/Application');
const Scholarship = require('../models/Scholarship');


router.post('/create-payment-intent', verifyStudent, async (req, res) => {
    try {
        const { scholarshipId } = req.body;
        const scholarship = await Scholarship.findById(scholarshipId);
        if (!scholarship) return res.status(404).json({ message: 'Scholarship not found' });

        const amount = Math.round((Number(scholarship.applicationFees) + Number(scholarship.serviceCharge || 0)) * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method_types: ['card'],
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/save-application', verifyStudent, async (req, res) => {
    try {
        const appData = req.body;
        const result = await Application.create(appData);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;