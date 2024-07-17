import React, { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';

const PhotoEditor = ({ image, onSave, onCancel }) => {
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
    const editorRef = useRef();

    const handleSave = () => {
        if (editorRef.current) {
            const canvas = editorRef.current.getImageScaledToCanvas();
            const editedImage = canvas.toDataURL(); // Get edited image as data URL
            onSave(editedImage); // Pass edited image data URL to parent component
        }
    };

    return (
        <div className="flex flex-col items-center p-4 bg-white rounded shadow-lg">
            <AvatarEditor
                ref={editorRef}
                image={image}
                width={200}
                height={200}
                border={50}
                scale={scale}
                rotate={rotate}
                borderRadius={100}  // Circle frame
                className="rounded-full"
            />
            <div className="flex flex-col items-center mt-4">
                <input
                    type="range"
                    value={scale}
                    min="1"
                    max="2"
                    step="0.01"
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                />
                <button onClick={() => setRotate((prev) => prev + 90)} className="mt-2">
                    Rotate
                </button>
                <div className="flex mt-4">
                    <button onClick={handleSave} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">
                        Set Photo
                    </button>
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white rounded">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PhotoEditor;
