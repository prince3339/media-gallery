/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Box,
    Card,
		Radio,
		TextField,
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
import InfiniteScroll from 'react-infinite-scroll-component';

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
	const [metadata, setMetadata] = useState(null);
	const [renderedData, setRenderedData] = useState([]);
	const [offset, setOffset] = useState(0);

	const classes = useStyles();

	const handleChange = (event) => {
		setOffset(0);
    setMediaType(event.target.value);
		setRenderedData([]);
  };

	const loadMore = () => {
		setOffset(offset + 40);
	}

	useEffect(() => {
		const fetchData = async () => {
			const authCredentials = process.env.NEXT_PUBLIC_AUTH_CREDENTIAL;
			const encodedCredentials = Buffer.from(authCredentials).toString('base64');
			const headers = {
				Authorization: `Basic ${encodedCredentials}`,
				'Content-Type': 'application/json',
			}
			try {
				const query = {
					offset,
					limit: 40,
					searchText: searchText || null,
					...(mediaType && {type: mediaType})
				}
				const mediaData = await axios.get(`${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/api/v1/medias?${queryString.stringify(query)}`, {
					headers
				});
	
				setMetadata(mediaData.data.metadata);
				setRenderedData((renderedData) => {
					return [...renderedData, ...mediaData.data.items];
				});
				setLoading(false)
			} catch (err) {
				console.log('Something went wrong', err);
			}
		};
	
		fetchData();
	}, [searchText, mediaType, offset]);

	if (isLoading) {
		return 'Loading...';
	}

	if (metadata?.pagination?.totalCount === 0 && !isLoading) {
		return 'No Data found!';
	}

	const { pagination: { totalCount } } = metadata;

  return (
    <Box padding={4}>
			
			<FormControl component="fieldset">
				<FormLabel component="legend">Media Type</FormLabel>
				<RadioGroup aria-label="gender" name="gender1" value={mediaType} onChange={handleChange}>
					<FormControlLabel value="IMAGE" control={<Radio />} label="Image" />
					<FormControlLabel value="VIDEO" control={<Radio />} label="Video" />
				</RadioGroup>
			</FormControl>
			<Box paddingTop={2}>
				<TextField id="outlined-search" label="Search by text" type="search" variant="outlined" onChange={(e) => {
					setOffset(0);
					setSearchTex(e.target.value);
					setRenderedData([]);
				}} />
			</Box>	
			<InfiniteScroll
					dataLength={totalCount} //This is important field to render the next data
					next={() => loadMore()}
					hasMore={true}
					loader={<h4>Loading...</h4>}
					endMessage={
						<p style={{ textAlign: 'center' }}>
							<b>Yay! You have seen it all</b>
						</p>
					}
				>
					<Box
						paddingTop={3}
						display="flex"
						justifyContent="flex-start"
						alignItems="start"
						gridGap={20}
						flexWrap="wrap"
					>
						{renderedData.map((media) => {
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
				</InfiniteScroll>
    </Box>
  );
}
