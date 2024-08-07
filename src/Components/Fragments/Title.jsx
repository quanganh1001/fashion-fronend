import { Helmet } from "react-helmet-async";

export default function Title({ title }) {
    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <h1>{title}</h1>
            <hr />
        </>
    );
}
