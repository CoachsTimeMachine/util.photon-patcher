async function patch_photon(old_pun, old_voice, new_pun, new_voice, file_buffer)
{
    console.log("Patching...")
    try
    {
        if (!new_pun)
            throw new Error("No Photon PUN provided.")
        if (!new_voice)
            throw new Error("No Photon Voice provided.")
                
        if (new_pun.length !== 36)
            throw new Error("Invalid Photon PUN replacement provided.")
        if (new_voice.length !== 36)
            throw new Error("Invalid Photon Voice replacement provided.")

        if (old_pun.length !== 36)
            throw new Error("Invalid Photon PUN original provided.")
        if (old_voice.length !== 36)
            throw new Error("Invalid Photon Voice original provided.")

        if (!file_buffer)
            throw new Error("resources.assets not provided.")

        const view = new Uint8Array(file_buffer);
        const encoder = new TextEncoder();

        const replacements = [
            { 
                search: encoder.encode(old_pun), 
                replace: encoder.encode(new_pun) 
            },
            { 
                search: encoder.encode(old_voice), 
                replace: encoder.encode(new_voice) 
            }
        ];

        for (const pair of replacements) 
        {
            const { search, replace } = pair;
                
            for (let i = 0; i <= view.length - search.length; i++) 
            {
                let match = true;
                for (let j = 0; j < search.length; j++) 
                {
                    if (view[i + j] !== search[j]) 
                    {
                        match = false;
                        break;
                    }
                }

                if (match)
                {
                    view.set(replace, i);
                    i += search.length - 1; // Skip ahead
                }
            }
        }
        console.log("Patched successfully!")

        return view;
    }
    catch(e)
    {
        console.error(e)
        throw new Error(e)
    }
}