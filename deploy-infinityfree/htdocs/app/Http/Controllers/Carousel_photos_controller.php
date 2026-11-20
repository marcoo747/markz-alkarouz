<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Carousel_photos;
use Illuminate\Support\Facades\Storage;

class Carousel_photos_controller extends Controller
{
    public function index()
    {
        $photos = Carousel_photos::all()->map(function ($photo) {
            return [
                'id' => $photo->id,
                'url' => ($photo->photo && Storage::disk('public')->exists($photo->photo))
                    ? asset('storage/' . $photo->photo)
                    : asset('imgs/img1.jpg'),
                'path' => $photo->photo,
            ];
        });

        return response()->json($photos);
    }

    public function upload_photo(Request $request)
    {
        $request->validate([
            'photo' => ['required', 'array', 'max:10'],
            'photo.*' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $created = [];
        foreach ($request->file('photo') as $photoFile) {
            $photoPath = $photoFile->store('carousel_photos', 'public');
            $created[] = Carousel_photos::create([
                'photo' => $photoPath,
            ]);
        }

        return response()->json([
            'message' => 'Photos uploaded successfully',
            'photos' => $created,
        ], 201);
    }

    public function destroy($id)
    {
        $photo = Carousel_photos::findOrFail($id);
        
        // Delete the file from storage
        if (Storage::disk('public')->exists($photo->photo)) {
            Storage::disk('public')->delete($photo->photo);
        }
        
        // Delete the record from database
        $photo->delete();

        return response()->json(['message' => 'Image deleted successfully']);
    }
}
