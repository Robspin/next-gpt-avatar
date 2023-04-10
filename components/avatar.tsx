

const Avatar = () => {
    return (
        <div className="w-full rounded-xl overflow-hidden flex relative">
            <div className="rounded-xl overflow-hidden absolute right-3 top-1">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                    }}
                >
                    <source src="/sci-fi.mp4" type="video/mp4" />
                </video>
            </div>
        </div>
    )
}

export default Avatar
