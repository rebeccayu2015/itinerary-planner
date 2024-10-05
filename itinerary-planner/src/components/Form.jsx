import { render } from "react-dom";
import { useForm } from "react-cool-form";

import "./form-styles.scss";

const Field = ({ label, id, ...rest }) => (
    <div>
        <label htmlFor={id}>{label}</label>
        <input id={id} {...rest} />
    </div>
);

function Form() {
    const { form } = useForm({
        onSubmit: (values) => alert(JSON.stringify(values, undefined, 2)),
    });

    return (
        <>
            <h1 id="form">Form</h1>
            <form ref={form}>
                <Field
                    label="What month or season do you want to travel?"
                    id="season"
                    name="season"
                    placeholder="i.e. Winter, July"
                />
                <Field
                    label="What is the max you want to spend on one activity?"
                    id="activity-budget"
                    name="activity-budget"
                    placeholder="i.e. $30"
                />
                <Field
                    label="What is the max you want to spend on one meal?"
                    id="meal-budget"
                    name="meal-budget"
                    placeholder="i.e. $30"
                />
                <Field
                    label="Would you like to explore more natural environments (parks, hiking spots, scenic views), or do you prefer staying in the heart of the city (restaurants, nightlife, city tours)?"
                    id="nature-city"
                    name="nature-city"
                    placeholder="i.e. balance of both"
                />
                <Field
                    label="Do you want more indoor experiences (museums, shopping, etc.) or outdoor adventures (parks, walking tours, etc.)?"
                    id="indoor-outdoor"
                    name="indoor-outdoor"
                    placeholder="i.e. outdoors"
                />
                <Field
                    label="Where will you be traveling from?"
                    id="departing-loc"
                    name="departing-loc"
                    placeholder="i.e. New York City"
                />
                <Field
                    label="Do you plan to use public transit (e.g., buses, trains, plane), rent a car, or will you have your own vehicle for getting around?"
                    id="transit"
                    name="transit"
                    placeholder="i.e. public transit"
                />
                <Field
                    label="Do you have a preferred type of accomodation (hotel, Airbnb, hostel) and/or nightly budget?"
                    id="accomodation"
                    name="accomodation"
                    placeholder="i.e. No preferred type, around $100 per night budget"
                />
                <input type="submit" />
            </form>
        </>
    );
}

render(<Form />, document.getElementById("root"));

export default Form