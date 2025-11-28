export function GoogleTest()
{
    const handleLoginWithGoogle = () =>
        window.location.href = 'https://localhost:7230/Client-API/login-with-google?returnUrl=http://localhost:50994';
    return (
        <>
            <button onClick={handleLoginWithGoogle}>Sign in with google</button>
        </>
    )
}