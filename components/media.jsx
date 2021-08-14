/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Box,
    Card,
		Radio,
		RadioGroup,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
		FormControl,
		FormLabel,
		FormControlLabel
} from '@material-ui/core';
import queryString from 'querystring';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

export default function MediaCard() {
	const [isLoading, setLoading] = useState(true);
	const [mediaType, setMediaType] = useState(null);
	const [searchText, setSearchTex] = useState(null);
	const [medias, setMedias] = useState([]);

	const classes = useStyles();

	const handleChange = (event) => {
    setMediaType(event.target.value);
  };

	useEffect(() => {
		async function fetchData() {
			const authCredentials = process.env.NEXT_PUBLIC_AUTH_CREDENTIAL;
			const encodedCredentials = Buffer.from(authCredentials).toString('base64');
			const headers = {
				Authorization: `Basic ${encodedCredentials}`,
				'Content-Type': 'application/json',
			}
			try {
				const query = {
					offset: 0,
					limit: 40,
					searchText: searchText || null,
					...(mediaType && {type: mediaType})
				}
				const mediaData = await axios.get(`${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/api/v1/medias?${queryString.stringify(query)}`, {
					headers
				});

				setMedias(mediaData.data);
				setLoading(false)
			} catch (err) {
				console.log('Something went wrong', err);
			}
		}
		fetchData();
	}, [mediaType, searchText]);

	if (isLoading) {
		return 'Loading...';
	}

  return (
    <Box padding={4}>
			<FormControl component="fieldset">
				<FormLabel component="legend">Media Type</FormLabel>
				<RadioGroup aria-label="gender" name="gender1" value={mediaType} onChange={handleChange}>
					<FormControlLabel value="IMAGE" control={<Radio />} label="Image" />
					<FormControlLabel value="VIDEO" control={<Radio />} label="Video" />
				</RadioGroup>
			</FormControl>
      <Box
				paddingTop={3}
				display="flex"
				justifyContent="flex-start"
				alignItems="start"
				gridGap={20}
				flexWrap="wrap"
			>
				{medias.items?.map((media) => {
					return (
						<Card key={media.id} className={classes.root}>
							<CardActionArea>
									{media.type === 'IMAGE' ? 
										<img src={media.mediaUrl} alt={media.title} width="100%" height="200" style={{objectFit: 'cover'}} />
										: <video src={media.mediaUrl}>Not supported</video>
									}
									<CardContent>
									<Typography gutterBottom variant="h5" component="h2">
											{media.title}
									</Typography>
									</CardContent>
							</CardActionArea>
						</Card>
					)
				})}
			</Box>
    </Box>
  );
}
