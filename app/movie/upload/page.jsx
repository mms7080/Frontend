import {Header} from '../../../components';
import {fetch} from "../../../lib/server";
import MovieUploader from "../../../components/movie/upload/movieuploader";

export default async function MovieUploadPage() {
    const userRes = await fetch(`${process.env.NEXT_PUBLIC_SPRING_SERVER_URL}/userinfo`);

    return <>
    <Header userInfo={userRes}/>
    <MovieUploader userInfo={userRes}/>
</>;
}