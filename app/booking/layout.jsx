import {Footer} from '../../components';

export default function movie_layout({children}) {
    return <>
    <div className="bg-[#141414]">
        {children}
    </div>
    <Footer/>
    </>;
}