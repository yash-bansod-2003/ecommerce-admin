"use client"

import { useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
    disabled: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: Array<string>;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled, onChange, onRemove, value
}) => {
    const [mounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    /* Cloudinary does not have a types so we used any */
    const onUpload = (result: any) => {
        onChange(result.info.secure_url)
    }

    if (!mounted) {
        return null;
    }

    return (
        <>
            <div className="mb-4 flex items-center gap-4">
                {
                    value.map((url) => {
                        return (
                            <div key={url} className="relative w-48 h-48 rounded-md overflow-hidden">
                                <div className="z-10 absolute top-2 right-2">
                                    <Button
                                        variant='destructive'
                                        size='icon'
                                        onClick={() => onRemove(url)}
                                    >
                                        <Trash className="h-5 w-5" />
                                    </Button>
                                </div>
                                <Image
                                    fill
                                    className="object-cover"
                                    src={url}
                                    alt="image"
                                />
                            </div>
                        )
                    })
                }
            </div>
            <CldUploadWidget onUpload={onUpload} uploadPreset="xkwzxzvw" >
                {({ open }) => {
                    function handleOnClick(e: any) {
                        e.preventDefault();
                        open();
                    }

                    return (
                        <Button
                            type="button"
                            disabled={disabled}
                            className="button"
                            variant="secondary"
                            onClick={handleOnClick}
                        >
                            <ImagePlus className="w-5 h-5 mr-2" />
                            upload and image
                        </Button>
                    );
                }}
            </CldUploadWidget>
        </>
    )
}