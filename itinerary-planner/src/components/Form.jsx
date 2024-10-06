import { render } from "react-dom";
import { useState, useEffect } from "react";

import "./form-styles.scss";

const Field = ({ label, id, value, ...rest }) => (
    <div>
        <label htmlFor={id}>{label}</label>
        <input id={id} value={value} required {...rest} />
    </div>
);

function Form() {
    const [formData, setFormData] = useState({});

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        try {
            const response = await fetch('http://localhost:3001/submit', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), // Send the form data
            });

            if (response.ok) {
                alert('Data written to file successfully!');
            } else {
                alert('Failed to write data to file.');
            }
        } catch (error) {
            alert('An error occurred: ' + error.message);
        }
        setFormData({});
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    useEffect(() => {
        fetch('http://localhost:3001/clear', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Send the form data
        });
    }, []);

    // Handle page refresh
    window.addEventListener("beforeunload", (event) => {
        fetch('http://localhost:3001/clear', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Send the form data
        });
        console.log("API call before page reload");
    });

    window.addEventListener("unload", (event) => {
        fetch('http://localhost:3001/clear', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Send the form data
        });
        console.log("API call after page reload");
    });

    return (
        <>
            <h1 id="form">Form</h1>
            <form onSubmit={handleSubmit}>
                <Field
                    label="What month or season do you want to travel?"
                    id="season"
                    name="season"
                    placeholder="i.e. Winter, July"
                    value={formData.season || ''}
                    onChange={handleChange}
                />
                <Field
                    label="What is the max you want to spend on one activity?"
                    id="activity-budget"
                    name="activity-budget"
                    placeholder="i.e. $30"
                    value={formData['activity-budget'] || ''}
                    onChange={handleChange}
                />
                <Field
                    label="What is the max you want to spend on one meal?"
                    id="meal-budget"
                    name="meal-budget"
                    placeholder="i.e. $30"
                    value={formData['meal-budget'] || ''}
                    onChange={handleChange}
                />
                <Field
                    label="Would you like to explore more natural environments (parks, hiking spots, scenic views), or do you prefer staying in the heart of the city (restaurants, nightlife, city tours)?"
                    id="nature-city"
                    name="nature-city"
                    placeholder="i.e. balance of both"
                    value={formData['nature-city'] || ''}
                    onChange={handleChange}
                />
                <Field
                    label="Do you want more indoor experiences (museums, shopping, etc.) or outdoor adventures (parks, walking tours, etc.)?"
                    id="indoor-outdoor"
                    name="indoor-outdoor"
                    placeholder="i.e. outdoors"
                    value={formData['indoor-outdoor'] || ''}
                    onChange={handleChange}
                />
                <Field
                    label="Where will you be traveling from?"
                    id="departing-loc"
                    name="departing-loc"
                    placeholder="i.e. New York City"
                    value={formData['departing-loc'] || ''}
                    onChange={handleChange}
                />
                <Field
                    label="Do you plan to use public transit (e.g., buses, trains, plane), rent a car, or will you have your own vehicle for getting around?"
                    id="transit"
                    name="transit"
                    placeholder="i.e. public transit"
                    value={formData.transit || ''}
                    onChange={handleChange}
                />
                <Field
                    label="Do you have a preferred type of accommodation (hotel, Airbnb, hostel) and/or nightly budget?"
                    id="accomodation"
                    name="accomodation"
                    placeholder="i.e. No preferred type, around $100 per night budget"
                    value={formData.accomodation || ''}
                    onChange={handleChange}
                />
                <input type="submit" />
            </form>
        </>
    );
}

render(<Form />, document.getElementById("root"));

export default Form;
