import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {FolderService} from './folder.service';
import nock from 'nock';
import path from 'path';
import tmp from 'tmp';
import fse from 'fs-extra';
import {SupportedWriteImageFormat} from '../../utils/filetype';
import mimeTypes from 'mime-types';
import {FolderType} from '../../types';
import {testService} from '../base/base.service.spec';
import {ImageModuleTest} from '../../engine/image/image.module.test';

describe('FolderService', () => {
	let folderService: FolderService;
	let imageModuleTest: ImageModuleTest;
	testService(
		(storeTest, imageModuleTestPara) => {
			imageModuleTest = imageModuleTestPara;
			folderService = new FolderService(storeTest.store.folderStore, storeTest.store.trackStore, imageModuleTest.imageModule);
		},
		() => {

			describe('setFolderImage', () => {
				it('should do handle invalid parameters', async () => {
					const folders = await folderService.folderStore.all();
					const folder = folders[0];
					await folderService.setFolderImage(folder, 'invalid-not-existent').should.eventually.be.rejectedWith(Error);
					await folderService.setFolderImage(folder, '').should.eventually.be.rejectedWith(Error);
				});
				it('should set an image', async () => {
					const folders = await folderService.folderStore.all();
					const folder = folders[0];
					folder.tag.image = undefined;
					const file = tmp.fileSync();
					await folderService.setFolderImage(folder, file.name);
					should().exist(folder.tag.image);
					const image = path.resolve(folder.path, folder.tag.image || 'invalid-not-existent');
					expect(await fse.pathExists(image)).to.equal(true, 'folder image file does not exist ' + image);
					file.removeCallback();
					const updatedFolder = await folderService.folderStore.byId(folder.id);
					should().exist(updatedFolder);
					if (!updatedFolder) {
						return;
					}
					expect(updatedFolder.tag.image).to.equal(folder.tag.image);
				});
			});

			describe('downloadFolderImage', () => {

				it('should do handle invalid parameters', async () => {
					const folders = await folderService.folderStore.all();
					const folder = folders[0];
					await folderService.downloadFolderImage(folder, 'invalid').should.eventually.be.rejectedWith(Error);
					await folderService.downloadFolderImage(folder, 'http://invaliddomain.invaliddomain.invaliddomain/invalid').should.eventually.be.rejectedWith(Error);
					const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
						.get('/invalid.png').reply(404);
					await folderService.downloadFolderImage(folder, 'http://invaliddomain.invaliddomain.invaliddomain/invalid.png').should.eventually.be.rejectedWith(Error);
					expect(scope.isDone()).to.equal(true, 'no request has been made');
				});
				it('should download an image', async () => {
					const folders = await folderService.folderStore.all();
					const folder = folders[0];
					const mockImage = await imageModuleTest.mockImage('png');
					const scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
						.get('/image.png').reply(200, mockImage.buffer, {'Content-Type': mockImage.mime});
					await folderService.downloadFolderImage(folder, 'http://invaliddomain.invaliddomain.invaliddomain/image.png');
					expect(scope.isDone()).to.equal(true, 'no request has been made');
					const filename = path.resolve(folder.path, folder.tag.image || 'invalid-not-existent');
					expect(await fse.pathExists(filename)).to.equal(true, 'folder image file does not exist ' + filename);
					const updatedFolder = await folderService.folderStore.byId(folder.id);
					should().exist(updatedFolder);
					if (!updatedFolder) {
						return;
					}
					expect(updatedFolder.tag.image).to.equal(folder.tag.image);
				});
			});

			describe('getFolderImage', () => {
				it('should return an empty response for not available images', async () => {
					const folders = await folderService.folderStore.all();
					const folder = folders[0];
					folder.tag.image = undefined;
					folder.info = undefined;
					const res = await folderService.getFolderImage(folder);
					should().not.exist(res);
				});
				it('should deliver local images', async () => {
					const folders = await folderService.folderStore.all();
					const folder = folders[0];
					folder.info = undefined;
					const mockImage = await imageModuleTest.mockImage('png');
					const filename = path.resolve(folder.path, 'dummy.png');
					await fse.writeFile(filename, mockImage.buffer);
					folder.tag.image = 'dummy.png';
					let res = await folderService.getFolderImage(folder);
					should().exist(res);
					if (res) {
						should().exist(res.file);
						if (res.file) {
							expect(res.file.filename).to.equal(filename);
						}
					}
					res = await folderService.getFolderImage(folder, 100);
					should().exist(res);
					if (res) {
						should().exist(res.buffer);
					}
					for (const format of SupportedWriteImageFormat) {
						res = await folderService.getFolderImage(folder, 100, format);
						should().exist(res, 'image format ' + format + ' did not work');
						if (res) {
							expect(!!res.buffer || !!res.file).to.equal(true);
							if (res.buffer) {
								const mime = mimeTypes.lookup(format);
								expect(res.buffer.contentType).to.equal(mime);
							}
							if (res.file) {
								expect(path.extname(res.file.filename)).to.equal('.' + format);
								expect(path.extname(res.file.name)).to.equal('.' + format);
							}
						}
					}
					await imageModuleTest.imageModule.clearImageCacheByID(folder.id);
				});

				it('should deliver remote images', async () => {
					const folders = await folderService.folderStore.all();
					const folder = folders[0];
					folder.tag.image = undefined;
					folder.tag.type = FolderType.album;
					folder.info = {
						album: {
							image: {
								large: 'http://invaliddomain.invaliddomain.invaliddomain/image.png'
							}
						},
						artist: {},
						topSongs: []
					};
					const mockImage = await imageModuleTest.mockImage('png');
					let scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
						.get('/image.png').reply(200, mockImage.buffer, {'Content-Type': mockImage.mime});
					let res = await folderService.getFolderImage(folder);
					should().exist(res);
					if (res) {
						expect(!!res.buffer || !!res.file).to.equal(true);
						if (res.file) {
							expect(path.extname(res.file.filename)).to.equal('.png');
							expect(res.file.name).to.equal(folder.id + '.png');
						}
					}
					expect(scope.isDone()).to.equal(true, 'no request has been made');
					folder.tag.image = undefined;
					folder.tag.type = FolderType.artist;
					folder.info = {
						artist: {
							image: {
								large: 'http://invaliddomain.invaliddomain.invaliddomain/image.png'
							}
						},
						album: {},
						topSongs: []
					};
					scope = nock('http://invaliddomain.invaliddomain.invaliddomain')
						.get('/image.png').reply(200, mockImage.buffer, {'Content-Type': mockImage.mime});
					res = await folderService.getFolderImage(folder);
					should().exist(res);
					if (res) {
						expect(!!res.buffer || !!res.file).to.equal(true);
						if (res.file) {
							expect(path.extname(res.file.filename)).to.equal('.png');
							expect(res.file.name).to.equal(folder.id + '.png');
						}
					}
					expect(scope.isDone()).to.equal(true, 'no request has been made');
				});
			});

			describe('renameFolder', function() {
				this.timeout(40000);
				it('should do handle invalid parameters', async () => {
					const folders = await folderService.folderStore.all();
					const folder = folders[0];
					await folderService.renameFolder(folder, '').should.eventually.be.rejectedWith(Error);
					await folderService.renameFolder(folder, '.').should.eventually.be.rejectedWith(Error);
					await folderService.renameFolder(folder, '//..*\.').should.eventually.be.rejectedWith(Error);
					await folderService.renameFolder(folder, path.basename(folder.path)).should.eventually.be.rejectedWith(Error);
				});
				it('should rename and update all folder & track paths', async () => {
					const folderIds = await folderService.folderStore.allIds();
					for (const id of folderIds) {
						const folder = await folderService.folderStore.byId(id);
						should().exist(folder);
						if (!folder) {
							return;
						}
						await folderService.renameFolder(folder, path.basename(folder.path) + '_renamed');
						const all = await folderService.folderStore.all();
						for (const f of all) {
							expect(await fse.pathExists(f.path)).to.equal(true, 'path does not exist ' + f.path);
						}
					}
				});

			});

			describe('collectFolderPath', () => {
				it('should do handle invalid parameters', async () => {
					let list = await folderService.collectFolderPath(undefined);
					expect(list.length).to.equal(0);
					list = await folderService.collectFolderPath('invalid');
					expect(list.length).to.equal(0);
				});
				it('should report the right parents', async () => {
					const folders = await folderService.folderStore.all();
					for (const f of folders) {
						const list = await folderService.collectFolderPath(f.id);
						expect(list.length).to.equal(f.tag.level + 1);
						list.forEach((item, index) => {
							expect(f.path.indexOf(item.path)).to.equal(0);
							expect(item.tag.level).to.equal(index);
						});
					}
				});

			});

		}
	);
});
